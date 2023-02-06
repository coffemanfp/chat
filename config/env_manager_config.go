package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"golang.org/x/oauth2/facebook"
	"golang.org/x/oauth2/google"
)

// EnvManagerConfig is the Config implementation for the environment config vars.
type EnvManagerConfig struct {
	config ConfigInfo
}

func (f EnvManagerConfig) Get() ConfigInfo {
	return f.config
}

// NewEnvManagerConfig initializes a new ConfigInfo instance by the env config vars.
// 	@return conf ConfigInfo: new ConfigInfo instance with the env vars information.
// 	@return err error: error getting env vars values.
func NewEnvManagerConfig() (conf ConfigInfo, err error) {
	conf, err = newConfigWithEnvVars()
	return
}

func newConfigWithEnvVars() (conf ConfigInfo, err error) {
	srvPort, err := getEnvInt("PORT")
	if err != nil {
		return
	}

	dbPort, err := getEnvInt("DB_PORT")
	if err != nil {
		return
	}

	conf = ConfigInfo{
		Server: server{
			Port:           srvPort,
			Host:           os.Getenv("SRV_HOST"),
			AllowedOrigins: strings.Split(os.Getenv("SRV_ALLOWED_ORIGINS"), ";"),
			SecretKey:      os.Getenv("SRV_SECRET_KEY"),
		},
		OAuth: oauth{
			Google: oauthProperties{
				ClientID:     os.Getenv("OAUTH_GOOGLE_CLIENT_ID"),
				ClientSecret: os.Getenv("OAUTH_GOOGLE_CLIENT_SECRET"),
				RedirectURIS: strings.Split(os.Getenv("OAUTH_GOOGLE_REDIRECT_URIS"), ";"),
				Scopes:       strings.Split(os.Getenv("OAUTH_GOOGLE_SCOPES"), ";"),
				Endpoint:     google.Endpoint,
			},
			Facebook: oauthProperties{
				ClientID:     os.Getenv("OAUTH_FACEBOOK_CLIENT_ID"),
				ClientSecret: os.Getenv("OAUTH_FACEBOOK_CLIENT_SECRET"),
				RedirectURIS: strings.Split(os.Getenv("OAUTH_FACEBOOK_REDIRECT_URIS"), ";"),
				Scopes:       strings.Split(os.Getenv("OAUTH_FACEBOOK_SCOPES"), ";"),
				Endpoint:     facebook.Endpoint,
			},
		},
		PostgreSQLProperties: postgreSQLProperties{
			User:     os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASS"),
			Name:     os.Getenv("DB_NAME"),
			Host:     os.Getenv("DB_HOST"),
			Port:     dbPort,
		},
	}
	return
}

func getEnvInt(n string) (i int, err error) {
	i, err = strconv.Atoi(os.Getenv(n))
	if err != nil {
		err = fmt.Errorf("failed to load env var int %s: %s", n, err)
	}
	return
}
