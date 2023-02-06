package psql

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/coffemanfp/chat/auth"
	"github.com/coffemanfp/chat/database"
	sErrors "github.com/coffemanfp/chat/errors"
	"github.com/coffemanfp/chat/users"
)

// AuthRepository is the implementation of a authentication repository for the PostgreSQL database.
type AuthRepository struct {
	db *sql.DB
}

// NewAuthRepository initializes a new auth repository instance.
// 	@param conn *PostgreSQLConnector: is the PostgreSQLConnector handler.
//	@return authRepo database.AuthRepository: is the final interface to keep
//	 the AuthRepository implementation.
//	@return err error: database connection error.
func NewAuthRepository(conn *PostgreSQLConnector) (authRepo database.AuthRepository, err error) {
	db, err := conn.getConn()
	if err != nil {
		return
	}
	authRepo = AuthRepository{
		db: db,
	}
	return
}

func (u AuthRepository) SignUp(user users.User, session auth.Session) (id int, err error) {
	tx, err := u.db.Begin()
	if err != nil {
		return
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
			return
		}
		err = tx.Commit()
	}()

	qInsertUser := `
		insert into	
			users(nickname, email, password, picture, created_at)
		values
			(nullif($1, ''), nullif($2, ''), $3, $4, $5)
		returning
			id
	`

	err = tx.QueryRow(qInsertUser, user.Nickname, user.Email, user.Password, user.Picture, user.CreatedAt).Scan(&id)
	if err != nil {
		var match bool
		match, err = newPQError(err).asAlreadyExists()
		if match {
			err = sErrors.NewClientError(http.StatusConflict, err.Error())
		} else {
			err = fmt.Errorf("failed to insert user %s: %s", user.Nickname, err)
		}
		return
	}

	// If the user has been sign with a external platform, insert the external platform sign record.
	if len(user.SignedWith) > 0 {
		sign := user.SignedWith[0]

		qInsertExtUserAuth := `
			insert into
				external_user_auth(id, user_id, email, picture, platform, created_at)
			values
				($1, $2, $3, $4, $5, $6)
		`
		_, err = tx.Exec(qInsertExtUserAuth, sign.ID, id, sign.Email, sign.Picture, sign.Platform, sign.CreatedAt)
		if err != nil {
			var match bool
			match, err = newPQError(err).asAlreadyExists()
			if match {
				err = sErrors.NewClientError(http.StatusConflict, err.Error())
			} else {
				err = fmt.Errorf("failed to insert external user auth %s %s: %s", user.Nickname, sign.Platform, err)
			}
		}
	}
	return
}

func (u AuthRepository) UpsertSession(session auth.Session) (err error) {
	qInsertSession := `
		insert into
			user_session(id, user_id, logged_at, last_seen_at, logged_with, actived)
		values
			($1, $2, $3, $4, $5, $6)
		on conflict (user_id, actived) do update set
			last_seen_at=$4
		where
			user_session.user_id=$2 and user_session.actived;
	`

	_, err = u.db.Exec(qInsertSession, session.ID, session.UserID, session.LoggedAt, session.LastSeenAt, session.LoggedWith, session.Actived)
	if err != nil {
		err = fmt.Errorf("failed to insert session of %d: %s", session.UserID, err)
	}
	return
}

func (u AuthRepository) MatchCredentials(user users.User) (id int, err error) {
	query := `
		select id from users where (nickname = $1 and password = $3) or (email = $2 and password = $3)
	`

	err = u.db.QueryRow(query, user.Nickname, user.Email, user.Password).Scan(&id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			err = nil
			return
		}
		err = fmt.Errorf("failed to get user credentials: %s", err)
	}
	return
}
