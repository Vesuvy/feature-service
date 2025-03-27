package handlers

import (
	"github.com/Vesuvy/feature-service/internal/models"
	"github.com/Vesuvy/feature-service/internal/repository"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type AuthHandler struct {
	adminRepository repository.AdminRepository
}

func NewAuthHandler(adminRepository repository.AdminRepository) *AuthHandler {
	return &AuthHandler{adminRepository: adminRepository}
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
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Company  string `json:"company" binding:"required"`
	}

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверные данные: " + err.Error()})
		return
	}

	// Проверка существования пользователя
	existingUser, _ := h.adminRepository.GetByEmail(newUser.Email)
	if existingUser != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Пользователь с таким email уже существует"})
		return
	}

	// Хеширование пароля (используйте bcrypt)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newUser.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка хеширования пароля"})
		return
	}

	// Создание пользователя
	admin := &models.Admin{
		Email:    newUser.Email,
		Password: string(hashedPassword),
		Company:  newUser.Company,
	}

	if err := h.adminRepository.Create(admin); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка регистрации: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Регистрация успешна",
		"admin": gin.H{
			"email":   admin.Email,
			"company": admin.Company,
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
