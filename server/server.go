package server

import (
	"fmt"
	"net/http"
	"time"

	"github.com/coffemanfp/chat/config"
	"github.com/coffemanfp/chat/database"
	"github.com/coffemanfp/chat/server/handlers"
	"github.com/coffemanfp/chat/server/handlers/auth"
	muxhandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

// Server handles the routes set up and handlers.
type Server struct {
	srv *http.Server
}

// Run starts the server listening.
func (s Server) Run() (err error) {
	return s.srv.ListenAndServe()
}

// NewServer initializes a new *Server instance.
//	@param conf config.ConfigInfo: keeps the current config information.
//	@param db database.Database: database for the repositories.
//	@param host string: host to listening.
//	@param port int: port to listening.
//	@return $1 *Server: new *Server instance.
func NewServer(conf config.ConfigInfo, db database.Database, host string, port int) *Server {
	r := mux.NewRouter().StrictSlash(false)
	v1R := r.PathPrefix("/api/v1").Subrouter()

	setUpMiddlewares(r, conf)
	setUpAPIHandlers(r)
	setUpAuthHandlers(v1R, conf, db)

	return &Server{
		srv: &http.Server{
			Handler: muxhandlers.CORS(
				muxhandlers.AllowedHeaders([]string{"content-type"}),
				muxhandlers.AllowedOrigins([]string{"*"}),
				muxhandlers.AllowCredentials(),
			)(r),
			Addr:         fmt.Sprintf("%s:%d", host, port),
			WriteTimeout: 30 * time.Second,
			ReadTimeout:  30 * time.Second,
		},
	}
}

func setUpAPIHandlers(r *mux.Router) {
	r.HandleFunc("/healthcheck", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, "OK")
	}).Methods("GET")
}

func setUpMiddlewares(r *mux.Router, conf config.ConfigInfo) {
	r.Use(logginMiddleware)
	r.Use(muxhandlers.RecoveryHandler(muxhandlers.PrintRecoveryStack(true)))
}

func setUpAuthHandlers(r *mux.Router, conf config.ConfigInfo, db database.Database) {
	repo, err := database.GetAuthRepository(db.Repositories)
	if err != nil {
		return
	}

	ah := auth.NewAuthHandler(
		repo,
		handlers.GetRequestReaderImpl(),
		handlers.GetResponseWriterImpl(),
		conf,
	)

	r.HandleFunc("/auth/{action}", ah.HandleAuth).Methods("POST")
}
