package storage

import (
	"errors"

	"github.com/Vesuvy/feature-service/internal/models"
)

type Storage interface {
	Save(f *models.Feature) error
	Pick(name string) (*models.Feature, error)
	Remove(f *models.Feature) error
	IsExists(f *models.Feature) (bool, error)
	Update(f *models.Feature) error
}

var ErrNoSavedFeature = errors.New("no saved feature")
