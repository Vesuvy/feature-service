package features

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/Vesuvy/feature-service/internal/models"
	"github.com/Vesuvy/feature-service/internal/storage"
)

type Storage struct {
	baseValue string
}

const defaultPerm = 0777 // доступ к файлу как в linux

func New(baseValue string) Storage {
	return Storage{baseValue: baseValue}
}

func (s Storage) Save(feature *models.Feature) (err error) {
	defer func() { err = e.WrapIfErr("cant save feature") }()

	featurePath := filepath.Join(s.baseValue, feature.Name)

	if err := os.MkdirAll(featurePath, defaultPerm); err != nil {
		fmt.Errorf("cant make dir")
	}

	featureName, err := featureName(feature)
	if err != nil {
		fmt.Errorf("error with fName")
	}
}

func featureName(f *models.Feature) (string, error) {
	return 
} 