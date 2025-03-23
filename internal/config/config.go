package config

import "os"

const (
	defaultPort = "8080"
	DBHost      = "localhost"
	DBPort      = 5432
	DBUser      = "postgres"
	DBPassword  = "postgres"
	DBName      = "feature_toggle"
	RedisPort   = 6379
	AdminToken  = "Bearer admin_token"
)

// key - имя переменной окружения, значение которой получаем
// fallback - Значение по умолчанию, которое будет возвращено, если переменная окружения не установлена
func GetEnv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func GetPort() string {
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = defaultPort
	}

	return port
}
