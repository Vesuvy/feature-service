package config

import "os"

const (
	defaultPort = "8080"
)

func GetPort() string {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = defaultPort
	}

	return port
}
