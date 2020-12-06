module github.com/at-silva/ddapi-todo

go 1.15

replace github.com/at-silva/ddapi => /home/atila/go/src/github.com/at-silva/ddapi

require (
	github.com/at-silva/ddapi v1.0.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/go-sql-driver/mysql v1.5.0
	github.com/jmoiron/sqlx v1.2.0
	github.com/mattn/go-sqlite3 v1.14.5
	github.com/onsi/ginkgo v1.14.2
	github.com/onsi/gomega v1.10.3
	golang.org/x/crypto v0.0.0-20200622213623-75b288015ac9
)
