package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
)

func GenerateJWT(id int, secretKey string) (tokenString string, err error) {
	var mySigningKey = []byte(secretKey)
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["id"] = id
	claims["exp"] = time.Now().Add(time.Hour * 3).Unix()

	tokenString, err = token.SignedString(mySigningKey)
	if err != nil {
		err = fmt.Errorf("something went wrong: %s", err)
	}
	return
}
