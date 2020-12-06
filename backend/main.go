package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/at-silva/ddapi-todo/backend/user"

	"github.com/at-silva/ddapi/db"
	"github.com/at-silva/ddapi/session"

	"github.com/at-silva/ddapi/handler"

	"github.com/at-silva/ddapi/check"
	"github.com/jmoiron/sqlx"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	secret := os.Getenv("DDAPI_TODO_SECRET")
	if secret == "" {
		panic("DDAPI_TODO_SECRET cannot be empty")
	}

	iss := os.Getenv("DDAPI_TODO_ISS")
	if iss == "" {
		panic("DDAPI_TODO_ISS cannot be empty")
	}

	dbPath := os.Getenv("DDAPI_TODO_DB")
	if dbPath == "" {
		panic("DDAPI_TODO_DB cannot be empty")
	}

	secretbs := []byte(secret)

	createUser := user.MakeCreate(mustOpenDB(dbPath, "rw"))
	createUserHandler := user.MakeHandler(iss, secretbs, createUser)
	http.Handle("/user", createUserHandler)

	getUser := user.MakeGet(mustOpenDB(dbPath, "ro"))
	getUserHandler := user.MakeHandler(iss, secretbs, getUser)
	http.Handle("/login", getUserHandler)

	execHandler := handler.NewExec(
		db.New(mustOpenDB(dbPath, "rw")),
		check.Signature(check.Sha256HMAC(secretbs)),
		session.Reader(session.HS256JWT(secretbs)),
		check.Params(check.JSONSchema),
	)
	http.Handle("/exec", execHandler)

	queryHandler := handler.NewQuery(
		db.New(mustOpenDB(dbPath, "ro")),
		check.Signature(check.Sha256HMAC(secretbs)),
		session.Reader(session.HS256JWT(secretbs)),
		check.Params(check.JSONSchema),
	)
	http.Handle("/query", queryHandler)

	log.Println("starting server at :8080")

	log.Fatalln(http.ListenAndServe(":8080", nil))
}

func mustOpenDB(dbPath, mode string) *sqlx.DB {
	db, err := sqlx.Open("sqlite3", fmt.Sprintf("file:%s?cache=shared&mode=%s", dbPath, mode))
	if err != nil {
		panic(err)
	}
	return db
}
