package config

import "golang.org/x/oauth2"

// Config is a interface to get the config of a given implementation.
type Config interface {
	// Get will get all the ConfigInfo available in the implementation
	Get() ConfigInfo
}

// ConfigInfo is the common structure to contain all the config fields.
type ConfigInfo struct {
	Server               server               `yaml:"server"`
	OAuth                oauth                `yaml:"oauth"`
	PostgreSQLProperties postgreSQLProperties `yaml:"psql"`
}

type server struct {
	Port           int      `yaml:"port"`
	Host           string   `yaml:"host"`
	AllowedOrigins []string `yaml:"allowed_origins"`
	SecretKey      string   `yaml:"secret_key"`
}

type oauth struct {
	Google   oauthProperties `yaml:"google"`
	Facebook oauthProperties `yaml:"facebook"`
}

type oauthProperties struct {
	ClientID     string   `yaml:"client_id"`
	ClientSecret string   `yaml:"client_secret"`
	RedirectURIS []string `yaml:"redirect_uris"`
	Scopes       []string `yaml:"scopes"`
	Endpoint     oauth2.Endpoint
}

type postgreSQLProperties struct {
	User     string `yaml:"user"`
	Password string `yaml:"password"`
	Name     string `yaml:"name"`
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
}
