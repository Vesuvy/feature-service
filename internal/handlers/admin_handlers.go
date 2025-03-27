package handlers

import (
	"net/http"

	"github.com/Vesuvy/feature-service/internal/repository"
	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	UserRepository     repository.AdminRepository
	CategoryRepository repository.CategoryRepository
	// TODO репы тегов и фич
}

func NewAdminHandler(userRepo repository.AdminRepository, categoryRepo repository.CategoryRepository) *AdminHandler {
	return &AdminHandler{
		UserRepository:     userRepo,
		CategoryRepository: categoryRepo,
	}
}

func (h *AdminHandler) GetStatsHandler(c *gin.Context) {
	// Получение статистики
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
