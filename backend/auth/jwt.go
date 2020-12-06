package auth

import (
	"fmt"
	"strconv"

	"github.com/dgrijalva/jwt-go"
)

// IssueJWT issues a new jwt for a give user ID
func IssueJWT(userID int64, iss string, secret []byte) (string, error) {
	if len(secret) == 0 {
		return "", fmt.Errorf("could not issue jwt: empty secret")
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Subject: strconv.FormatInt(userID, 10),
		Issuer:  iss,
	})

	st, err := t.SignedString(secret)
	if err != nil {
		return "", fmt.Errorf("could not issue jwt: %w", err)
	}

	return st, nil
}
