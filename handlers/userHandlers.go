package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/Vesuvy/feature-service/models"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-gonic/gin"
)

// Создать пользователя
func CreateUserHandler(c *gin.Context, dbStruct *service.DbStruct) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	companyID, _ := c.Get("company_id")
	user.CompanyID = companyID.(uint)
	if err := dbStruct.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось создать пользователя"})
		return
	}
	c.JSON(http.StatusCreated, user)
}

// Получить список пользователей компании
func ListUsersHandler(c *gin.Context, dbStruct *service.DbStruct) {
	companyID, _ := c.Get("company_id")
	var users []models.User
	if err := dbStruct.DB.Where("company_id = ?", companyID).Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить список пользователей"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"users": users})
}

// Обновить пользователя по ID
func UpdateUserHandler(c *gin.Context, dbStruct *service.DbStruct) {
	userID := c.Param("userID")
	companyID, _ := c.Get("company_id")
	var user models.User
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(userID), companyID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "пользователь не найден"})
		return
	}
	var update struct {
		Name   string `json:"name"`
		TagIDs string `json:"tag_ids"`
	}
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user.Name = update.Name
	user.TagIDs = update.TagIDs
	if err := dbStruct.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось обновить пользователя"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// Удалить пользователя по ID
func DeleteUserHandler(c *gin.Context, dbStruct *service.DbStruct) {
	userID := c.Param("userID")
	companyID, _ := c.Get("company_id")
	var user models.User
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(userID), companyID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "пользователь не найден"})
		return
	}
	if err := dbStruct.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось удалить пользователя"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}

// Назначить теги пользователю
func AssignTagsToUserHandler(c *gin.Context, dbStruct *service.DbStruct) {
	userID := c.Param("userID")
	companyID, _ := c.Get("company_id")
	var user models.User
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(userID), companyID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "пользователь не найден"})
		return
	}
	var req struct {
		TagIDs []uint `json:"tag_ids"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	strIDs := make([]string, len(req.TagIDs))
	for i, id := range req.TagIDs {
		strIDs[i] = fmt.Sprint(id)
	}
	user.TagIDs = strings.Join(strIDs, ",")
	if err := dbStruct.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось назначить теги"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// Получить теги пользователя (GET /users/:userID/tags)
func GetUserTagsHandler(c *gin.Context, dbStruct *service.DbStruct) {
	userID := c.Param("userID")
	companyID, _ := c.Get("company_id")
	var user models.User
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(userID), companyID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "пользователь не найден"})
		return
	}
	var tagIDs []uint
	for _, s := range strings.Split(user.TagIDs, ",") {
		if s == "" {
			continue
		}
		if id, err := strconv.ParseUint(s, 10, 64); err == nil {
			tagIDs = append(tagIDs, uint(id))
		}
	}
	var tags []models.Tag
	if len(tagIDs) > 0 {
		dbStruct.DB.Where("id IN ? AND company_id = ?", tagIDs, companyID).Find(&tags)
	}
	c.JSON(http.StatusOK, gin.H{"tags": tags})
}

// Удалить все теги пользователя (DELETE /users/:userID/tags)
func RemoveAllUserTagsHandler(c *gin.Context, dbStruct *service.DbStruct) {
	userID := c.Param("userID")
	companyID, _ := c.Get("company_id")
	var user models.User
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(userID), companyID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "пользователь не найден"})
		return
	}
	user.TagIDs = ""
	if err := dbStruct.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось удалить теги"})
		return
	}
	c.JSON(http.StatusOK, user)
}
