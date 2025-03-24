package main

import (
	"github.com/Vesuvy/feature-service/internal/config"
	"github.com/Vesuvy/feature-service/internal/middleware"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	port := config.GetPort()

	r := gin.Default()

	// Публичные маршруты
	r.POST("/login", loginHandler)
	r.POST("/registration", registerHandler)

	// Защищённые маршруты
	authGroup := r.Group("/api")
	authGroup.Use(middleware.AuthMiddleware()) // Применяем middleware ко всей группе
	{
		authGroup.GET("/profile", profileHandler)
		authGroup.POST("/features", createFeatureHandler)
	}

	// Админские маршруты с дополнительной проверкой
	adminGroup := r.Group("/admin")
	adminGroup.Use(middleware.AuthMiddleware())
	adminGroup.Use(adminCheckMiddleware) // Доп. проверка isAdmin
	{
		adminGroup.GET("/stats", adminStatsHandler)
	}

	err := r.Run(":" + port)
	if err != nil {
		return
	}
}

// Дополнительный middleware для проверки админских прав
func adminCheckMiddleware(c *gin.Context) {
	isAdmin, exists := c.Get("isAdmin")
	if !exists || !isAdmin.(bool) {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "требуется доступ администратора"})
		return
	}
	c.Next()
}

// Обработчик входа
func loginHandler(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	// Здесь должна быть логика проверки пользователя в БД
	// Это пример - замените на реальную проверку!
	if credentials.Email != "admin@example.com" || credentials.Password != "password" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный email или пароль"})
		return
	}

	// Генерация JWT токена (упрощённый пример)
	token := "example_jwt_token" // Замените на реальную генерацию токена

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"email":   credentials.Email,
			"isAdmin": true, // В реальном приложении брать из БД
		},
	})
}

// Обработчик регистрации
func registerHandler(c *gin.Context) {
	var newUser struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Company  string `json:"company"`
	}

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	// Здесь должна быть логика создания пользователя в БД
	// Это пример - замените на реальную логику!

	c.JSON(http.StatusCreated, gin.H{
		"message": "пользователь успешно зарегистрирован",
		"user": gin.H{
			"email":   newUser.Email,
			"company": newUser.Company,
		},
	})
}

// Обработчик профиля пользователя
func profileHandler(c *gin.Context) {
	// Получаем данные пользователя из контекста (установленные в AuthMiddleware)
	userID, _ := c.Get("userID")
	isAdmin, _ := c.Get("isAdmin")

	c.JSON(http.StatusOK, gin.H{
		"userID":  userID,
		"isAdmin": isAdmin,
		"message": "данные профиля",
		// Добавьте другие данные пользователя по необходимости
	})
}

// Обработчик создания фичи
func createFeatureHandler(c *gin.Context) {
	var newFeature struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Enabled     bool   `json:"enabled"`
	}

	if err := c.ShouldBindJSON(&newFeature); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	// Здесь логика сохранения фичи в БД
	// Это пример - замените на реальную логику!

	c.JSON(http.StatusCreated, gin.H{
		"message": "фича успешно создана",
		"feature": newFeature,
	})
}

// Обработчик статистики для админа
func adminStatsHandler(c *gin.Context) {
	// В реальном приложении здесь запрос к БД для получения статистики
	// Это пример - замените на реальные данные!
	stats := gin.H{
		"totalUsers":     42,
		"activeFeatures": 15,
		"usageStats": gin.H{
			"lastWeek":  1500,
			"lastMonth": 6500,
		},
	}

	c.JSON(http.StatusOK, gin.H{
		"stats": stats,
	})
}
