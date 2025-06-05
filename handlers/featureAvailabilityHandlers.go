package handlers

import (
	"net/http"

	"github.com/Vesuvy/feature-service/models"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-gonic/gin"
)

// обрабатывает запрос на включение/выключение фичи для определенных тегов
func ToggleFeatureForTagsHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	companyID, _ := c.Get("company_id")

	// Проверяем, существует ли фича и принадлежит ли она компании
	var feature models.Feature
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(featureID), companyID).First(&feature).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "фича не найдена"})
		return
	}

	// Получаем данные из запроса
	var request struct {
		TagIDs   []uint `json:"tagIds"`
		IsActive bool   `json:"isActive"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Для каждого тега обновляем или создаем запись FeatureAvailability
	for _, tagID := range request.TagIDs {
		// Проверяем, существует ли тег и принадлежит ли он компании
		var tag models.Tag
		if err := dbStruct.DB.Where("id = ? AND company_id = ?", tagID, companyID).First(&tag).Error; err != nil {
			continue // Пропускаем несуществующие теги
		}

		// Ищем существующую запись
		var availability models.FeatureAvailability
		result := dbStruct.DB.Where("feature_id = ? AND tag_id = ?", parseUint(featureID), tagID).First(&availability)

		if result.Error != nil {
			// Создаем новую запись, если не существует
			availability = models.FeatureAvailability{
				FeatureID: parseUint(featureID),
				TagID:     tagID,
				IsActive:  request.IsActive,
			}
			dbStruct.DB.Create(&availability)
		} else {
			// Обновляем существующую запись
			availability.IsActive = request.IsActive
			dbStruct.DB.Save(&availability)
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "статус фичи для тегов успешно обновлен"})
}

// возвращает статус фичи для всех тегов
func GetFeatureTagsHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	companyID, _ := c.Get("company_id")

	// Проверяем, существует ли фича и принадлежит ли она компании
	var feature models.Feature
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(featureID), companyID).First(&feature).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "фича не найдена"})
		return
	}

	// Получаем все теги компании
	var tags []models.Tag
	if err := dbStruct.DB.Where("company_id = ?", companyID).Find(&tags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить теги"})
		return
	}

	// Для каждого тега проверяем статус фичи
	type TagStatus struct {
		TagID    uint   `json:"tagId"` // Поменять названия?
		Title    string `json:"title"`
		IsActive bool   `json:"isActive"`
	}

	var result []TagStatus
	for _, tag := range tags {
		var availability models.FeatureAvailability
		isActive := false

		// Проверяем, есть ли запись в FeatureAvailability
		if err := dbStruct.DB.Where("feature_id = ? AND tag_id = ?", parseUint(featureID), tag.ID).First(&availability).Error; err == nil {
			isActive = availability.IsActive
		}

		result = append(result, TagStatus{
			TagID:    tag.ID,
			Title:    tag.Title,
			IsActive: isActive,
		})
	}

	c.JSON(http.StatusOK, gin.H{"message": "статусы выданы"})
}
