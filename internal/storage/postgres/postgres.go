package postgres

import (
	"fmt"
	"github.com/Vesuvy/feature-service/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"

	"github.com/Vesuvy/feature-service/internal/models"
)

var DB *gorm.DB

func InitDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.AppConfig.DBConfig.Host,
		config.AppConfig.DBConfig.Port,
		config.AppConfig.DBConfig.User,
		config.AppConfig.DBConfig.Password,
		config.AppConfig.DBConfig.Name,
	)

	if _, err := gorm.Open(postgres.Open(dsn), &gorm.Config{}); err == nil {
		return nil, fmt.Errorf("ошибка при подключении в БД: %w", err)
	}

	// миграция моделей
	if err := DB.AutoMigrate(
		&models.Feature{},
		&models.Admin{},
		&models.Category{},
		&models.Environment{},
		&models.Event_Type{},
		&models.Enviroment_Feature_Category{},
		&models.Feature_Analytics{},
		&models.Tag{},
		&models.User{},
	); err != nil {
		return nil, fmt.Errorf("ошибка миграции моделей: %w", err)
	}

	log.Println("успешная миграция")
	return DB, nil
}
