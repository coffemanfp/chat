package main

import (
	"fmt"
	"log"

	"github.com/coffemanfp/chat/config"
	"github.com/coffemanfp/chat/database"
	"github.com/coffemanfp/chat/database/psql"
	"github.com/coffemanfp/chat/server"
)

func main() {
	fmt.Println("Starting...")

	conf, err := config.NewConfig("local", "config")
	if err != nil {
		log.Fatal(err)
	}

	db, err := setUpDatabase(conf)
	if err != nil {
		log.Fatal(err)
	}

	server, err := server.NewServer(db, conf.Server.Host, conf.Server.Port)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Listening on port: %d\n", conf.Server.Port)
	log.Fatal(server.Run())
}

func setUpDatabase(conf config.Config) (db database.Database, err error) {
	db.Conn = psql.NewPostgreSQLConnector(
		conf.PostgreSQLProperties.User,
		conf.PostgreSQLProperties.Password,
		conf.PostgreSQLProperties.Name,
		conf.PostgreSQLProperties.Host,
		conf.PostgreSQLProperties.Port,
	)

	err = db.Conn.Connect()
	if err != nil {
		log.Fatal(err)
	}

	usersRepo, err := psql.NewUserRepository(db.Conn.(*psql.PostgreSQLConnector))
	if err != nil {
		return
	}

	db.Repositories = map[database.RepositoryID]interface{}{
		database.USERS_REPOSITORY: usersRepo,
	}
	return
}