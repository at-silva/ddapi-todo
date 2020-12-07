package user

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

const (
	// AccessDeniedMsg error message
	AccessDeniedMsg = "access denied"
)

var (
	// ErrAccessDenied error struct
	ErrAccessDenied = errors.New(AccessDeniedMsg)
)

// IDFunc retrieves a user ID given a username and a password
type IDFunc func(ctx context.Context, username, password string) (int64, error)

// MakeCreate makes a create user func given a database
func MakeCreate(db *sqlx.DB) IDFunc {
	return func(ctx context.Context, username, password string) (int64, error) {
		pwd, err := bcrypt.GenerateFromPassword([]byte(password), 14)
		if err != nil {
			return 0, fmt.Errorf("could not encrypt password: %w", err)
		}

		const q = `insert into user(user_username, user_password) values(?,?)`
		r, err := db.ExecContext(ctx, q, username, pwd)
		if err != nil {
			return 0, fmt.Errorf("could not create user: %w", err)
		}

		userID, err := r.LastInsertId()
		if err != nil {
			return 0, fmt.Errorf("could not retrieve user id: %w", err)
		}

		return userID, nil
	}
}

// MakeGet makes a get user func given a database
func MakeGet(db *sqlx.DB) IDFunc {
	return func(ctx context.Context, username, password string) (int64, error) {
		const q = `select user_id, user_password from user where user_username = ?`
		r := db.QueryRow(q, username)
		if errors.Is(r.Err(), sql.ErrNoRows) {
			return 0, ErrAccessDenied
		}
		if r.Err() != nil {
			return 0, fmt.Errorf("could not query user: %w", r.Err())
		}

		var (
			userID int64
			pwd    string
		)

		err := r.Scan(&userID, &pwd)
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrAccessDenied
		}
		if err != nil {
			return 0, fmt.Errorf("could not scan user: %w", err)
		}

		err = bcrypt.CompareHashAndPassword([]byte(pwd), []byte(password))
		if err != nil {
			return 0, ErrAccessDenied
		}

		return userID, nil
	}
}
