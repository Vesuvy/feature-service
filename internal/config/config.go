package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort string
	DBConfig   DBConfig
	RedisPort  int
	AdminToken string
	JWTSecret  string
}

type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
}

var AppConfig Config

func init() {
	// Загружаем .env файл
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Инициализируем конфигурацию
	AppConfig = Config{
		ServerPort: getEnv("SERVER_PORT", "8080"),
		DBConfig: DBConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvAsInt("DB_PORT", 5432),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			Name:     getEnv("DB_NAME", "feature_toggle"),
		},
		RedisPort:  getEnvAsInt("REDIS_PORT", 6379),
		AdminToken: getEnv("ADMIN_TOKEN", "Bearer admin_token"),
		JWTSecret:  getEnv("JWT_SECRET", "qwezxc"),
	}
}

// Вспомогательные функции для чтения переменных окружения

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	strValue := getEnv(key, "")
	if value, err := strconv.Atoi(strValue); err == nil {
		return value
	}
	return fallback
}

func getEnvAsBool(key string, fallback bool) bool {
	strValue := getEnv(key, "")
	if value, err := strconv.ParseBool(strValue); err == nil {
		return value
	}
	return fallback
}
