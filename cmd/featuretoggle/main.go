package main

import (
	"log"

	"github.com/Vesuvy/feature-service/config"
	"github.com/Vesuvy/feature-service/handlers"
	"github.com/Vesuvy/feature-service/middleware"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	dbStruct := &service.DbStruct{}
	dbStruct.InitDB()

	r := gin.Default()

	// Настройка CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},                   // Разрешить запросы с фронтенда
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Разрешенные методы
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	/*
		// Создание администратора по умолчанию, чтобы не было ошибок при создании админа
		dbStruct.DB.Create(&models.Company{ID: 1, Title: "Default Company"})

		defaultPassword := "admin"
		hashedPassword, _ := service.HashPassword(defaultPassword)
		dbStruct.DB.Create(&models.Admin{Email: "admin@ex.com", Password: hashedPassword, CompanyID: 1, RegistrationDate: time.Now()})
	*/
	// Публичные маршруты
	r.POST("/api/v1/registration", func(c *gin.Context) {
		handlers.RegisterHandler(c, dbStruct)
	})
	r.POST("/api/v1/login", func(c *gin.Context) {
		handlers.LoginHandler(c, dbStruct)
	})

	// Защищённые маршруты с JWT
	v1 := r.Group("/api/v1", middleware.AuthMiddleware())
	{
		v1.GET("/feature/:featureID", func(c *gin.Context) {
			handlers.GetFeatureHandler(c, dbStruct)
		})

		admin := v1.Group("/admin")
		{
			// Feature routes
			admin.POST("/features", func(c *gin.Context) {
				handlers.CreateFeatureHandler(c, dbStruct)
			})
			admin.PUT("/features/:featureID", func(c *gin.Context) {
				handlers.UpdateFeatureHandler(c, dbStruct)
			})
			admin.GET("/features", func(c *gin.Context) {
				handlers.ListFeaturesHandler(c, dbStruct)
			})
			admin.DELETE("/features/:featureID", func(c *gin.Context) {
				handlers.DeleteFeatureHandler(c, dbStruct)
			})
			admin.POST("/features/:featureID", func(c *gin.Context) {
				handlers.ToggleFeatureHandler(c, dbStruct)
			})
			admin.GET("/features/:featureID/categories", func(c *gin.Context) {
				handlers.GetFeatureCategoriesHandler(c, dbStruct)
			})
			// переключить фичи для тегов
			admin.POST("/features/:featureID/tags", func(c *gin.Context) {
				handlers.ToggleFeatureForTagsHandler(c, dbStruct)
			})
			// фичи по набору тегов
			admin.GET("/features/:featureID/tags", func(c *gin.Context) {
				handlers.GetFeatureTagsHandler(c, dbStruct)
			})

			// Category routes
			admin.POST("/categories", func(c *gin.Context) {
				handlers.CreateCategoryHandler(c, dbStruct)
			})
			admin.GET("/categories", func(c *gin.Context) {
				handlers.ListCategoriesHandler(c, dbStruct)
			})
			admin.PUT("/categories/:categoryID", func(c *gin.Context) {
				handlers.UpdateCategoryHandler(c, dbStruct)
			})
			admin.DELETE("/categories/:categoryID", func(c *gin.Context) {
				handlers.DeleteCategoryHandler(c, dbStruct)
			})

			// Tag routes
			admin.POST("/tags", func(c *gin.Context) {
				handlers.CreateTagHandler(c, dbStruct)
			})
			admin.GET("/tags", func(c *gin.Context) {
				handlers.ListTagsHandler(c, dbStruct)
			})
			admin.PUT("/tags/:tagID", func(c *gin.Context) {
				handlers.UpdateTagHandler(c, dbStruct)
			})
			admin.DELETE("/tags/:tagID", func(c *gin.Context) {
				handlers.DeleteTagHandler(c, dbStruct)
			})
		}

		v1.POST("features/:featureID/log", func(c *gin.Context) {
			handlers.LogFeatureUsageHandler(c, dbStruct)
		})

	}

	// Start server
	port := config.AppConfig.ServerPort
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Неудалось запустить сервер: %v", err)
	}
}
