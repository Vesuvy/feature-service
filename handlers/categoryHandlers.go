package handlers

// CreateCategoryHandler godoc
// @Summary Create a new category
// @Tags categories
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param input body models.Category true "Category data"
// @Success 201 {object} models.Category
// @Router /categories [post]

/*
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
func GetCategoriesHandler(c *gin.Context) {
	categories, err := h.categoryRepository.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"categories": categories})
}

*/

import (
	"net/http"

	"github.com/Vesuvy/feature-service/models"
	"github.com/Vesuvy/feature-service/service"
	"github.com/gin-gonic/gin"
)

// CreateCategoryHandler godoc
// @Summary Create a new category
// @Description Creates a new category for the authenticated company
// @Tags categories
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param input body models.Category true "Category data"
// @Success 201 {object} models.Category "Created category"
// @Failure 400 {object} object{error=string} "Invalid request body"
// @Failure 500 {object} object{error=string} "Failed to create category"
// @Router /categories [post]
func CreateCategoryHandler(c *gin.Context, dbStruct *service.DbStruct) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	companyID, _ := c.Get("company_id")
	category.CompanyID = companyID.(uint)

	if err := dbStruct.DB.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось создать категорию"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// ListCategoriesHandler godoc
// @Summary List all categories
// @Description Retrieves a list of all categories for the authenticated company
// @Tags categories
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} object{categories=[]models.Category} "List of categories"
// @Failure 500 {object} object{error=string} "Failed to retrieve categories"
// @Router /categories [get]
func ListCategoriesHandler(c *gin.Context, dbStruct *service.DbStruct) {
	companyID, _ := c.Get("company_id")
	var categories []models.Category
	if err := dbStruct.DB.Where("company_id = ?", companyID).Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось получить список категорий"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"categories": categories})
}

// UpdateCategoryHandler godoc
// @Summary Update a category
// @Description Updates an existing category by ID for the authenticated company
// @Tags categories
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param categoryID path string true "Category ID"
// @Param input body object{title=string,desc=string} true "Category update data"
// @Success 200 {object} models.Category "Updated category"
// @Failure 400 {object} object{error=string} "Invalid request body"
// @Failure 404 {object} object{error=string} "Category not found"
// @Failure 500 {object} object{error=string} "Failed to update category"
// @Router /categories/{categoryID} [put]
func UpdateCategoryHandler(c *gin.Context, dbStruct *service.DbStruct) {
	categoryID := c.Param("categoryID")
	companyID, _ := c.Get("company_id")
	var category models.Category
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(categoryID), companyID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "категория не найдена"})
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

	category.Title = update.Title
	category.Desc = update.Desc

	if err := dbStruct.DB.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось обновить категорию"})
		return
	}

	c.JSON(http.StatusOK, category)
}

// DeleteCategoryHandler godoc
// @Summary Delete a category
// @Description Deletes a category by ID for the authenticated company
// @Tags categories
// @Produce json
// @Security ApiKeyAuth
// @Param categoryID path string true "Category ID"
// @Success 204 "Category deleted successfully"
// @Failure 404 {object} object{error=string} "Category not found"
// @Failure 500 {object} object{error=string} "Failed to delete category"
// @Router /categories/{categoryID} [delete]
func DeleteCategoryHandler(c *gin.Context, dbStruct *service.DbStruct) {
	categoryID := c.Param("categoryID")
	companyID, _ := c.Get("company_id")
	var category models.Category
	if err := dbStruct.DB.Where("id = ? AND company_id = ?", parseUint(categoryID), companyID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "категория не найдена"})
		return
	}

	if err := dbStruct.DB.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "не удалось удалить категорию"})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
