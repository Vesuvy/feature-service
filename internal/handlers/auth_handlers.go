package handlers

import (
	"github.com/Vesuvy/feature-service/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
)

type AuthHandler struct {
	userRepository repository.UserRepository
}

func NewAuthHandler(userRepository repository.UserRepository) *AuthHandler {
	return &AuthHandler{userRepository: userRepository}
}

// Обработчик входа
func (h *AuthHandler) LoginHandler(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	// TODO Здесь должна быть логика проверки пользователя в БД
	if credentials.Email != "admin@example.com" || credentials.Password != "password" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный email или пароль"})
		return
	}

	// Генерация JWT токена (упрощённый пример)
	token := "example_jwt_token" // TODO Заменить на токен

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user": gin.H{
			"email":   credentials.Email,
			"isAdmin": true, // TODO потом из бд
		},
	})
}

// Обработчик регистрации
func (h *AuthHandler) RegisterHandler(c *gin.Context) {
	var newUser struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Company  string `json:"company"`
	}

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	// TODO Здесь должна быть логика создания пользователя в БД
	c.JSON(http.StatusCreated, gin.H{
		"message": "пользователь успешно зарегистрирован",
		"user": gin.H{
			"email":   newUser.Email,
			"company": newUser.Company,
		},
	})
}

// Обработчик профиля пользователя
func (h *AuthHandler) ProfileHandler(c *gin.Context) {
	// Получаем данные пользователя из контекста (установленные в AuthMiddleware)
	userID, _ := c.Get("userID")
	isAdmin, _ := c.Get("isAdmin")

	c.JSON(http.StatusOK, gin.H{
		"userID":  userID,
		"isAdmin": isAdmin,
		"message": "данные профиля",
	})
}
