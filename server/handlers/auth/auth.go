package auth

import (
	"errors"
	"log"
	"net/http"

	"github.com/coffemanfp/chat/auth"
	"github.com/coffemanfp/chat/config"
	"github.com/coffemanfp/chat/database"
	sErrors "github.com/coffemanfp/chat/errors"
	"github.com/coffemanfp/chat/server/handlers"
	"github.com/coffemanfp/chat/users"
	"github.com/gorilla/mux"
)

type handlerName string

func (hN handlerName) string() string {
	return string(hN)
}

// AuthHandler represents a handler for sign actions like sign up and login.
// Handles external sign platforms and own-server sign service.
type AuthHandler struct {
	config     config.ConfigInfo
	repository database.AuthRepository
	writer     handlers.ResponseWriter
	reader     handlers.RequestReader

	// userReaders keeps the services to be used for read the user info which is trying to sign.
	userReaders map[handlerName]userReader
}

// userReader represents a service which reads the user info.
type userReader interface {
	// read reads the user info and return it in a new instance.
	//  @param w http.ResponseWriter: response writer of the call.
	//  @param r *http.Request: request instance of the call.
	//	@return $1 users.User: new user information instance.
	//	@return $2 error: connection or reading error.
	read(w http.ResponseWriter, r *http.Request) (users.User, error)
}

// NewAuthHandler initializes a new AuthHandler instance.
//  @param repo database.AuthRepository: AuthRepository interface for the authentication handling.
//  @param r handlers.RequestReader: RequestReader interface for reading request operations.
//  @param w handlers.ResponseWriter: ResponseWriter interface for writing request response operations.
//  @param conf config.ConfigInfo: keeps the config information of the service.
//  @return u AuthHandler: new AuthHandler instance.
func NewAuthHandler(repo database.AuthRepository, r handlers.RequestReader, w handlers.ResponseWriter, conf config.ConfigInfo) (u AuthHandler) {
	return AuthHandler{
		reader:     r,
		writer:     w,
		repository: repo,
		config:     conf,
		userReaders: map[handlerName]userReader{
			systemHandlerName: systemUserReader{
				reader: r,
				writer: w,
			},
		},
	}
}

// HandleAuth implements the user authentication actions.
func (a AuthHandler) HandleAuth(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling auth...")
	vars := mux.Vars(r)
	action := vars["action"]

	userReader, err := a.getUserReader(handlerName("system"))
	if err != nil {
		a.handleError(w, err)
		return
	}

	log.Printf("Sending %s sign up", "system")
	user, err := userReader.read(w, r)
	if err != nil {
		a.handleError(w, err)
		return
	}

	var id, responseCode int
	switch action {
	case "signup":
		id, err = a.handleSignUp(user, w, r)
		if err != nil {
			a.handleError(w, err)
			return
		}
		responseCode = 201
	case "login":
		id, err = a.handleLogin(user, w, r)
		if err != nil {
			a.handleError(w, err)
			return
		}
		responseCode = 200
	}

	token, err := auth.GenerateJWT(id, a.config.Server.SecretKey)
	if err != nil {
		a.handleError(w, err)
		return
	}

	a.writer.JSON(w, responseCode, token)
	log.Println("Success ", action)
}

// handleSignUp performs a sign up process for the user requested.
//  @param user users.User: user to sign up.
//  @return tmpID string: just-one-use tmp id.
func (a AuthHandler) handleSignUp(user users.User, w http.ResponseWriter, r *http.Request) (id int, err error) {
	id, _, err = a.signUp(user)
	return
}

// handleLogin performs a login process for the user requested.
//  @param user users.User: user to login.
//  @return tmpID string: just-one-use tmp id.
func (a AuthHandler) handleLogin(user users.User, w http.ResponseWriter, r *http.Request) (id int, err error) {
	id, _, err = a.login(user)
	return
}

// signUp perfoms the user sign up process.
//  @param userR users.User: user to sign up.
//	@return user users.User: ending-user information.
//	@return session auth.Session: new session of the user.
//	@return err error: sign up, validation or connection error
func (a AuthHandler) signUp(userR users.User) (id int, session auth.Session, err error) {
	log.Printf("Saving sign up of %s %s", userR.Nickname, userR.Email)

	userR, err = users.New(userR)
	if err != nil {
		return
	}

	platform := "system"
	if len(userR.SignedWith) > 0 {
		platform = userR.SignedWith[0].Platform
	}

	id, err = a.repository.SignUp(userR, session)
	if err != nil {
		return
	}

	log.Println("New generated user")

	session, err = auth.NewSession(id, platform)
	if err != nil {
		return
	}

	err = a.repository.UpsertSession(session)
	if err != nil {
		return
	}

	log.Println("New generated session")
	log.Println("Successfully registered in database")
	return
}

// login performs the user login process.
//  @param userR users.User: user to login.
//	@return session auth.Session: new session of the user.
//	@return err error: login, validation or connection error
func (a AuthHandler) login(userR users.User) (id int, session auth.Session, err error) {
	log.Printf("Creating login session of %s %s", userR.Nickname, userR.Email)

	err = users.HashPassword(&userR.Password)
	if err != nil {
		return
	}

	id, err = a.repository.MatchCredentials(userR)
	if err != nil {
		return
	}

	if id == 0 {
		err = sErrors.NewClientError(http.StatusUnauthorized, "credentials don't match: invalid credentials of user %s %s", userR.Nickname, userR.Email)
		return
	}

	platform := systemHandlerName
	if len(userR.SignedWith) > 0 {
		platform = handlerName(userR.SignedWith[0].Platform)
	}

	session, err = auth.NewSession(id, platform.string())
	if err != nil {
		return
	}

	err = a.repository.UpsertSession(session)
	log.Println("New generated session")
	return
}

func (a AuthHandler) getUserReader(name handlerName) (r userReader, err error) {
	r, ok := a.userReaders[name]
	if !ok {
		err = sErrors.NewClientError(http.StatusBadRequest, "invalid signup handler: %s not exists", name)
	}
	return
}

func (a AuthHandler) handleError(w http.ResponseWriter, err error) {
	hErr, ok := err.(sErrors.ClientError)
	if !ok {
		log.Println(err)
		a.writer.JSON(w, http.StatusInternalServerError, handlers.Hash{
			"message": sErrors.SERVER_ERROR_MESSAGE,
		})
		return
	}
	a.writer.JSON(w, hErr.HTTPCode(), handlers.Hash{
		"message": hErr.Error(),
	})
}

// CheckAuthHandler handler to check if the user is authenticated for auth-required routes.
type CheckAuthHandler struct {
	next   http.Handler
	writer handlers.ResponseWriter
}

func (c CheckAuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	_, err := r.Cookie("auth")
	if err != nil {
		if errors.Is(err, http.ErrNoCookie) {
			// not authorized
			w.Header().Set("Location", "/")
			w.WriteHeader(http.StatusTemporaryRedirect)
		} else {
			log.Printf("failed to load authentication cookie: %s", err)
			c.writer.JSON(w, http.StatusInternalServerError, handlers.Hash{
				"message": sErrors.SERVER_ERROR_MESSAGE,
			})
		}
		return
	}

	c.next.ServeHTTP(w, r)
}

// NewCheckAuthHandler initializes a new CheckAuthHandler middleware.
func NewCheckAuthHandler(w handlers.ResponseWriter) func(http.Handler) http.Handler {
	return func(n http.Handler) http.Handler {
		return &CheckAuthHandler{
			next:   n,
			writer: w,
		}
	}
}

// CheckNoAuthHandler handler to check if the user is not authenticated for no-required auth routes.
type CheckNoAuthHandler struct {
	next   http.Handler
	writer handlers.ResponseWriter
}

func (c CheckNoAuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	_, err := r.Cookie("auth")
	if err != nil && err != http.ErrNoCookie {
		log.Printf("failed to load authentication cookie: %s", err)
		c.writer.JSON(w, http.StatusInternalServerError, handlers.Hash{
			"message": sErrors.SERVER_ERROR_MESSAGE,
		})
		return
	}

	w.Header().Set("Location", "/chat")
	w.WriteHeader(http.StatusTemporaryRedirect)

	c.next.ServeHTTP(w, r)
}

// NewCheckNoAuthHandler initializes a new CheckNoAuthHandler middleware.
func NewCheckNoAuthHandler(w handlers.ResponseWriter) func(http.Handler) http.Handler {
	return func(n http.Handler) http.Handler {
		return &CheckNoAuthHandler{
			next:   n,
			writer: w,
		}
	}
}
