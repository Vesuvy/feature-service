package handlers

import (
	"net/http"

	"github.com/Vesuvy/feature-service/models"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-gonic/gin"
)

// создает новый тег
func CreateTagHandler(c *gin.Context, dbStruct *service.DbStruct) {
	var tag models.Tag
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	companyID, _ := c.Get("company_id")
	tag.CompanyID = companyID.(uint)
	if err := dbStruct.DB.Create(&tag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось создать тег"})
		return
	}
	c.JSON(http.StatusCreated, tag)
}

// возвращает список всех тегов
func ListTagsHandler(c *gin.Context, dbStruct *service.DbStruct) {
	companyID, _ := c.Get("company_id")
	var tags []models.Tag
	if err := dbStruct.DB.Where("company_id = ?", companyID).Find(&tags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить список тегов"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tags": tags})
}

// обновляет существующий тег по ID
func UpdateTagHandler(c *gin.Context, dbStruct *service.DbStruct) {
	tagID := c.Param("tagID")
	companyID, _ := c.Get("company_id")
	var tag models.Tag
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(tagID), companyID).First(&tag).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "тег не найден"})
		return
	}
	var update struct {
		Title string `json:"title"`
		Desc  string `json:"desc"`
	}
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	tag.Title = update.Title
	tag.Desc = update.Desc
	if err := dbStruct.DB.Save(&tag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось обновить тег"})
		return
	}
	c.JSON(http.StatusOK, tag)
}

// DeleteTagHandler удаляет тег по ID
func DeleteTagHandler(c *gin.Context, dbStruct *service.DbStruct) {
	tagID := c.Param("tagID")
	companyID, _ := c.Get("company_id")
	var tag models.Tag
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(tagID), companyID).First(&tag).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "тег не найден"})
		return
	}
	if err := dbStruct.DB.Delete(&tag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось удалить тег"})
		return
	}
	c.JSON(http.StatusNoContent, nil)
}
