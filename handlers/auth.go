package handlers

import (
	"net/http"
	"time"

	"github.com/Vesuvy/feature-service/models"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Обработчик регистрации
func RegisterHandler(c *gin.Context, dbStruct *service.DbStruct) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
		Company  string `json:"company" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверные данные: " + err.Error()})
		return
	}

	// Проверка существования пользователя
	var existingAdmin models.Admin
	if err := dbStruct.DB.Where("email = ?", input.Email).First(&existingAdmin).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Пользователь с таким email уже существует"})
		return
	}

	// Проверка существования компании
	var existingCompany models.Company
	if err := dbStruct.DB.Where("title = ?", input.Company).First(&existingCompany).Error; err != nil {
		// Если компания не найдена — создаём новую
		existingCompany = models.Company{Title: input.Company}
		if err := dbStruct.DB.Create(&existingCompany).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании компании: " + err.Error()})
			return
		}
	}

	// Хеширование пароля
	hashedPassword, err := service.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка хеширования пароля"})
		return
	}

	// Создание админа
	admin := &models.Admin{
		Email:            input.Email,
		Password:         hashedPassword,
		CompanyID:        existingCompany.ID,
		RegistrationDate: time.Now(),
	}
	if err := dbStruct.DB.Create(&admin).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании админа в БД: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Регистрация успешна"})
}

// Обработчик входа
func LoginHandler(c *gin.Context, dbStruct *service.DbStruct) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Ошибка": err.Error()})
		return
	}

	// проверка админа в БД
	var admin models.Admin
	if err := dbStruct.DB.Where("email = ?", input.Email).First(&admin).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "неверные учетные данные"})
		return
	}

	// сравнение паролей
	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "неверные учетные данные (пароль)"})
		return
	}

	// Генерация JWT
	token, err := service.GenerateToken(input.Email, admin.CompanyID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка при генерации токена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
