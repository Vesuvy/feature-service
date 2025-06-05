package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Vesuvy/feature-service/models"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-gonic/gin"
)

func CreateFeatureHandler(c *gin.Context, dbStruct *service.DbStruct) {
	var requestData struct {
		Title      string `json:"title"`
		Desc       string `json:"desc"`
		Enabled    bool   `json:"enabled"`
		Categories []uint `json:"categories"`
	}

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	companyID, _ := c.Get("company_id")

	feature := models.Feature{
		Title:     requestData.Title,
		Desc:      requestData.Desc,
		Enabled:   requestData.Enabled,
		CompanyID: companyID.(uint),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Начинаем транзакцию для создания фичи и связей с категориями
	tx := dbStruct.DB.Begin()

	// Создаем фичу
	if err := tx.Create(&feature).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось создать фичу"})
		return
	}

	// Создаем связи с категориями
	for _, categoryID := range requestData.Categories {
		// Проверяем, что категория существует и принадлежит этой компании
		var category models.Category
		if err := tx.Where("id = ? AND company_id = ?", categoryID, companyID).First(&category).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "категория не найдена или не принадлежит вашей компании"})
			return
		}

		featureCategory := models.FeatureCategory{
			FeatureID:  feature.ID,
			CategoryID: categoryID,
		}

		if err := tx.Create(&featureCategory).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось связать фичу с категорией"})
			return
		}
	}

	// Фиксируем транзакцию
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось создать фичу и связи с категориями"})
		return
	}

	// Устанавливаем значение в Redis
	dbStruct.Redis.Set(c, fmt.Sprintf("feature:%d", feature.ID), feature.Enabled, 24*time.Hour)

	// Получаем категории для ответа
	var categories []models.Category
	if len(requestData.Categories) > 0 {
		if err := dbStruct.DB.Where("id IN (?) AND company_id = ?", requestData.Categories, companyID).Find(&categories).Error; err != nil {
			// Ошибка не критична для ответа, просто возвращаем фичу без категорий
			c.JSON(http.StatusCreated, feature)
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{
		"feature":    feature,
		"categories": categories,
	})
}

func GetFeatureHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	companyID, _ := c.Get("company_id")
	var feature *models.Feature
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", featureID, companyID).First(&feature).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "фича не найдена"})
		return
	}
	c.JSON(http.StatusOK, feature)
}

func UpdateFeatureHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	companyID, _ := c.Get("company_id")

	// Проверяем, существует ли фича и принадлежит ли она этой компании
	var feature models.Feature
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(featureID), companyID).First(&feature).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "фича не найдена"})
		return
	}

	// Получаем данные для обновления
	var requestData struct {
		Title      string `json:"title"`
		Desc       string `json:"desc"`
		Enabled    bool   `json:"enabled"`
		Categories []uint `json:"categories"`
	}

	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Начинаем транзакцию
	tx := dbStruct.DB.Begin()

	// Обновляем данные фичи
	feature.Title = requestData.Title
	feature.Desc = requestData.Desc
	feature.Enabled = requestData.Enabled
	feature.UpdatedAt = time.Now()

	if err := tx.Save(&feature).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось обновить фичу"})
		return
	}

	// Удаляем все существующие связи с категориями
	if err := tx.Where("feature_id = ?", feature.ID).Delete(&models.FeatureCategory{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось обновить связи с категориями"})
		return
	}

	// Создаем новые связи с категориями
	for _, categoryID := range requestData.Categories {
		// Проверяем, что категория существует и принадлежит этой компании
		var category models.Category
		if err := tx.Where("id = ? AND company_id = ?", categoryID, companyID).First(&category).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "категория не найдена или не принадлежит вашей компании"})
			return
		}

		featureCategory := models.FeatureCategory{
			FeatureID:  feature.ID,
			CategoryID: categoryID,
		}

		if err := tx.Create(&featureCategory).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось связать фичу с категорией"})
			return
		}
	}

	// Фиксируем транзакцию
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось обновить фичу и связи с категориями"})
		return
	}

	// Обновляем значение в Redis
	dbStruct.Redis.Set(c, fmt.Sprintf("feature:%d", feature.ID), feature.Enabled, 24*time.Hour)

	// Получаем категории для ответа
	var categories []models.Category
	if len(requestData.Categories) > 0 {
		if err := dbStruct.DB.Where("id IN (?) AND company_id = ?", requestData.Categories, companyID).Find(&categories).Error; err != nil {
			// Ошибка не критична для ответа, просто возвращаем фичу без категорий
			c.JSON(http.StatusOK, feature)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"feature":    feature,
		"categories": categories,
	})
}

func ListFeaturesHandler(c *gin.Context, dbStruct *service.DbStruct) {
	companyID, _ := c.Get("company_id")
	var features []models.Feature
	if err := dbStruct.DB.Where("company_id = ?", companyID).Find(&features).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить список фич"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"features": features})
}

func DeleteFeatureHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	companyID, _ := c.Get("company_id")
	var feature models.Feature
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", featureID, companyID).First(&feature).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "фича не найдена"})
		return
	}
	if err := dbStruct.DB.Delete(&feature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось удалить фичу"})
		return
	}
	dbStruct.Redis.Del(c, fmt.Sprintf("feature:%d", feature.ID))
	c.JSON(http.StatusNoContent, nil)
}

func ToggleFeatureHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	companyID, _ := c.Get("company_id")
	var feature models.Feature
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(featureID), companyID).First(&feature).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "фича не найдена"})
		return
	}
	var update struct {
		Enabled bool `json:"enabled"`
	}
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	feature.Enabled = update.Enabled
	feature.UpdatedAt = time.Now()
	if err := dbStruct.DB.Save(&feature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось обновить статус фичи"})
		return
	}
	dbStruct.Redis.Set(c, fmt.Sprintf("feature:%d", feature.ID), feature.Enabled, 24*time.Hour)
	c.JSON(http.StatusOK, feature)
}

func LogFeatureUsageHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	var logEntry struct {
		EventType string  `json:"eventType"`
		Duration  float64 `json:"duration"`
		Status    string  `json:"status"`
	}
	if err := c.ShouldBindJSON(&logEntry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var eventType models.EventType
	if err := dbStruct.DB.Where("title = ?", logEntry.EventType).First(&eventType).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "тип события " + logEntry.EventType + " не найден"})
		return
	}
	analytics := models.FeatureAnalytics{
		FeatureID:   parseUint(featureID),
		EventTypeID: eventType.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(time.Duration(logEntry.Duration) * time.Millisecond),
		Status:      logEntry.Status,
		Duration:    logEntry.Duration,
	}
	dbStruct.DB.Create(&analytics)

	var usage models.FeatureUsage
	if err := dbStruct.DB.Where("feature_analytics_id = ?", analytics.ID).First(&usage).Error; err != nil {
		usage = models.FeatureUsage{
			FeatureAnalyticsID: analytics.ID,
			UsageCount:         1,
			ErrorCount:         0,
			AvgExecutionTime:   logEntry.Duration,
		}
		if logEntry.Status == "error" {
			usage.ErrorCount = 1
		}
		dbStruct.DB.Create(&usage)
	} else {
		usage.UsageCount++
		if logEntry.Status == "error" {
			usage.ErrorCount++
		}
		usage.AvgExecutionTime = (usage.AvgExecutionTime*float64(usage.UsageCount-1) + float64(logEntry.Duration)) / float64(usage.UsageCount)
		dbStruct.DB.Save(&usage)
	}

	c.JSON(http.StatusCreated, gin.H{"message": "логирование успешно завершено"})
}

func GetFeatureCategoriesHandler(c *gin.Context, dbStruct *service.DbStruct) {
	featureID := c.Param("featureID")
	companyID, _ := c.Get("company_id")

	var featureCategories []models.FeatureCategory
	if err := dbStruct.DB.Where("feature_id = ?", featureID).Find(&featureCategories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить категории фичи"})
		return
	}

	var categoryIDs []uint
	for _, fc := range featureCategories {
		categoryIDs = append(categoryIDs, fc.CategoryID)
	}

	var categories []models.Category
	if err := dbStruct.DB.Where("id IN (?) AND company_id = ?", categoryIDs, companyID).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить категории"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"categories": categories})
}

// парсер uint
func parseUint(s string) uint {
	var result uint
	fmt.Sscanf(s, "%d", &result)
	return result
}
