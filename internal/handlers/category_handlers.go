package handlers

import (
	"github.com/Vesuvy/feature-service/internal/repository"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"

	"github.com/Vesuvy/feature-service/internal/models"
)

type CategoryHandler struct {
	categoryRepository repository.CategoryRepository
}

func NewCategoryHandler(categoryRepository repository.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{categoryRepository: categoryRepository}
}

// CreateCategoryHandler godoc
// @Summary Create a new category
// @Tags categories
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param input body models.Category true "Category data"
// @Success 201 {object} models.Category
// @Router /categories [post]
func (h *CategoryHandler) CreateCategoryHandler(c *gin.Context) {
	var input models.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if err := h.categoryRepository.Create(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"category": input})
}

// GetCategoriesHandler godoc
// @Summary Get all categories
// @Tags categories
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} []models.Category
// @Router /categories [get]
func (h *CategoryHandler) GetCategoriesHandler(c *gin.Context) {
	categories, err := h.categoryRepository.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"categories": categories})
}

// GetCategoryByIdHandler godoc
// @Summary Get category by ID
// @Tags categories
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Category ID"
// @Success 200 {object} models.Category
// @Router /categories/{id} [get]
func (h *CategoryHandler) GetCategoryByIdHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	category, err := h.categoryRepository.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"category": category})
}

// UpdateCategoryHandler godoc
// @Summary Update category
// @Tags categories
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Category ID"
// @Param input body models.Category true "Category data"
// @Success 200 {object} models.Category
// @Router /categories/{id} [put]
func (h *CategoryHandler) UpdateCategoryHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	var input models.Category
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	input.ID = id

	if err := h.categoryRepository.Update(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"category": input})
}

// DeleteCategoryHandler godoc
// @Summary Delete category
// @Tags categories
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Category ID"
// @Success 204
// @Router /categories/{id} [delete]
func (h *CategoryHandler) DeleteCategoryHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid category ID"})
		return
	}

	if err := h.categoryRepository.Delete(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
