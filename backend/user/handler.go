package user

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/at-silva/ddapi-todo/backend/auth"
)

type (
	request struct {
		Username string `json:"usr"`
		Password string `json:"pwd"`
	}

	response struct {
		Data  string  `json:"data"`
		Error *string `json:"error"`
	}
)

// MakeHandler makes a generic user handler
func MakeHandler(iss string, jwtSecret []byte, getUserID IDFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		b, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, errEncode(fmt.Errorf("could not read body: %w", err)), http.StatusBadRequest)
			return
		}

		if len(b) == 0 {
			http.Error(w, errEncode(errors.New("body cannot be empty")), http.StatusBadRequest)
			return
		}

		var req request
		err = json.Unmarshal(b, &req)
		if err != nil {
			http.Error(w, errEncode(fmt.Errorf("could not unmarshal body: %w", err)), http.StatusBadRequest)
			return
		}

		if req.Username == "" {
			http.Error(w, errEncode(errors.New("username cannot be empty")), http.StatusBadRequest)
			return
		}

		if req.Password == "" {
			http.Error(w, errEncode(errors.New("password cannot be empty")), http.StatusBadRequest)
			return
		}

		userID, err := getUserID(r.Context(), req.Username, req.Password)
		if errors.Is(ErrAccessDenied, err) {
			http.Error(w, errEncode(err), http.StatusUnauthorized)
			return
		}

		if err != nil {
			http.Error(w, errEncode(fmt.Errorf("could not get user: %w", err)), http.StatusInternalServerError)
			return
		}

		token, err := auth.IssueJWT(userID, iss, jwtSecret)
		if err != nil {
			http.Error(w, errEncode(fmt.Errorf("could not issue jwt: %w", err)), http.StatusInternalServerError)
			return
		}

		resp, _ := json.Marshal(response{token, nil})

		_, err = w.Write(resp)
		if err != nil {
			log.Println("[ERROR]", err)
		}
	}
}

func errEncode(err error) string {
	e, _ := json.Marshal(struct {
		Data  *struct{} `json:"data"`
		Error string    `json:"error"`
	}{
		nil,
		err.Error(),
	})

	return string(e)
}
