package service

import (
	"fmt"
	"log"

	"github.com/Vesuvy/feature-service/config"
	"github.com/Vesuvy/feature-service/models"
	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DbStruct struct {
	DB    *gorm.DB
	Redis *redis.Client
}

func (dbStruct *DbStruct) InitDB() {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.AppConfig.DBConfig.Host,
		config.AppConfig.DBConfig.Port,
		config.AppConfig.DBConfig.User,
		config.AppConfig.DBConfig.Password,
		config.AppConfig.DBConfig.Name,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("ошибка при подключении в БД:", err)
	}
	dbStruct.DB = db

	// миграция моделей
	if err := db.AutoMigrate(
		&models.Admin{},
		&models.Category{},
		&models.Company{},
		&models.Environment{},
		&models.EventType{},
		&models.Feature{},
		&models.FeatureAnalytics{},
		&models.FeatureAvailability{},
		&models.FeatureCategory{},
		&models.FeatureUsage{},
		&models.Tag{},
		&models.User{},
	); err != nil {
		log.Fatal("ошибка миграции моделей:", err)
	} else {
		log.Println("успешная миграция")
	}

	// Подключение к Redis
	dbStruct.Redis = redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})
}
