package repository

import (
	"errors"
	"fmt"
	"github.com/Vesuvy/feature-service/internal/models"
	"gorm.io/gorm"
)

type AdminRepository interface {
	Create(admin *models.Admin) error
	GetByEmail(email string) (*models.Admin, error)
}

type adminRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) AdminRepository {
	return &adminRepository{db: db}
}

func (r *adminRepository) Create(admin *models.Admin) error {
	result := r.db.Create(admin)
	if result.Error != nil {
		return fmt.Errorf("failed to create admin: %w", result.Error)
	}
	return nil
}

func (r *adminRepository) GetByEmail(email string) (*models.Admin, error) {
	var admin models.Admin
	result := r.db.Where("email = ?", email).First(&admin)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get admin: %w", result.Error)
	}
	return &admin, nil
}
