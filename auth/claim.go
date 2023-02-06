package auth

import "github.com/golang-jwt/jwt"

type Credentials struct {
	Nickname string `json:"nickname"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Claims struct {
	ID string `json:"id"`
	jwt.StandardClaims
}
