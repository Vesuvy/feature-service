package repository

import (
	"errors"
	"fmt"
	"github.com/Vesuvy/feature-service/internal/models"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	Create(category *models.Category) error
	GetAll() ([]models.Category, error)
	GetByID(id int) (*models.Category, error)
	Update(category *models.Category) error
	Delete(id int) error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(category *models.Category) error {
	result := r.db.Create(category)
	if result.Error != nil {
		return fmt.Errorf("failed to create category: %w", result.Error)
	}
	return nil
}

func (r *categoryRepository) GetAll() ([]models.Category, error) {
	var categories []models.Category
	result := r.db.Find(&categories)
	if result.Error != nil {
		return nil, fmt.Errorf("failed to get categories: %w", result.Error)
	}
	return categories, nil
}

func (r *categoryRepository) GetByID(id int) (*models.Category, error) {
	var category models.Category
	result := r.db.First(&category, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("category not found")
		}
		return nil, fmt.Errorf("failed to get category: %w", result.Error)
	}
	return &category, nil
}

func (r *categoryRepository) Update(category *models.Category) error {
	result := r.db.Save(category)
	if result.Error != nil {
		return fmt.Errorf("failed to update category: %w", result.Error)
	}
	return nil
}

func (r *categoryRepository) Delete(id int) error {
	var category models.Category
	result := r.db.Delete(&category, id)
	if result.Error != nil {
		return fmt.Errorf("failed to delete category: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("category not found")
	}
	return nil
}
