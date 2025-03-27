package main

import (
	"github.com/Vesuvy/feature-service/internal/config"
	"github.com/Vesuvy/feature-service/internal/handlers"
	"github.com/Vesuvy/feature-service/internal/middleware"
	"github.com/Vesuvy/feature-service/internal/repository"
	"github.com/Vesuvy/feature-service/internal/storage/postgres"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func main() {

	// Инициализация базы данных
	db, err := postgres.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Инициализация репозиториев
	categoryRepository := repository.NewCategoryRepository(db)
	userRepository := repository.NewUserRepository(db)

	// Инициализация обработчиков
	authHandler := handlers.NewAuthHandler(userRepository)
	categoryHandler := handlers.NewCategoryHandler(categoryRepository)
	adminHandler := handlers.NewAdminHandler(userRepository, categoryRepository) // TODO потом еще теги и фичи

	// Настройка роутера Gin
	r := gin.Default()

	// Публичные маршруты
	r.POST("/login", authHandler.LoginHandler)
	r.POST("/registration", authHandler.RegisterHandler)

	// Защищённые маршруты
	authGroup := r.Group("/api")
	authGroup.Use(middleware.AuthMiddleware()) // Применяем middleware ко всей группе
	{
		authGroup.GET("/profile", authHandler.ProfileHandler)
		authGroup.POST("/categories", categoryHandler.CreateCategoryHandler)
	}

	// Админские маршруты с дополнительной проверкой
	adminGroup := r.Group("/admin")
	adminGroup.Use(middleware.AuthMiddleware())
	adminGroup.Use(middleware.AdminCheckMiddleware) // Доп. проверка isAdmin
	{
		adminGroup.GET("/stats", adminHandler.GetStatsHandler)
		adminGroup.POST("/categories", categoryHandler.CreateCategoryHandler)
		// TODO сделать фичи, теги
	}

	// Запуск сервера
	port := config.AppConfig.ServerPort
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
