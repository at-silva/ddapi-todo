package auth_test

import (
	"strconv"

	"github.com/at-silva/ddapi-todo/backend/auth"
	"github.com/dgrijalva/jwt-go"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Login", func() {

	Describe("IssueJWT", func() {

		var (
			secret []byte
			userID int
		)

		const (
			validJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwic3ViIjoiMSJ9.v3pYhZe2IndKA8f3PPdnxS0d_KRFa79eH2x_LRq_CsI"
			issuer   = "https://example.com"
		)

		BeforeEach(func() {
			secret = []byte("my_secret")
			userID = 1
		})

		It("should isssue a valid JWT", func() {
			s, err := auth.IssueJWT(userID, issuer, secret)
			Expect(err).ShouldNot(HaveOccurred())
			Expect(s).Should(Equal(validJWT))
			cs := jwt.MapClaims{}
			t, err := jwt.ParseWithClaims(s, cs, func(_ *jwt.Token) (interface{}, error) { return secret, nil })
			Expect(err).ShouldNot(HaveOccurred())
			Expect(t.Valid).Should(BeTrue())
			Expect(cs["sub"]).Should(Equal(strconv.Itoa(userID)))
		})

		It("should fail when the secret is empty", func() {
			_, err := auth.IssueJWT(userID, issuer, []byte{})
			Expect(err).Should(HaveOccurred())
		})

	})

})
