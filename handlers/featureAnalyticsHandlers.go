package handlers

import (
	"net/http"

	"github.com/Vesuvy/feature-service/models"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-gonic/gin"
)

func CreateFeatureAnalyticsHandler(c *gin.Context, dbStruct *service.DbStruct) {
	var analytics models.FeatureAnalytics
	if err := c.ShouldBindJSON(&analytics); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	companyID, _ := c.Get("company_id")
	analytics.CompanyID = companyID.(uint)

	if err := dbStruct.DB.Create(&analytics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось создать аналитику"})
		return
	}

	c.JSON(http.StatusCreated, analytics)
}

func ListFeatureAnalyticsHandler(c *gin.Context, dbStruct *service.DbStruct) {
	companyID, _ := c.Get("company_id")
	var analytics []models.FeatureAnalytics
	if err := dbStruct.DB.Where("company_id = ?", companyID).Find(&analytics).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить аналитику"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"analytics": analytics})
}
