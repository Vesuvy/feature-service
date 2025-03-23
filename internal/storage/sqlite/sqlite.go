package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/Vesuvy/feature-service/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"

	"github.com/Vesuvy/feature-service/internal/models"
)

var DB *gorm.DB

func initDB() {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		config.DBHost, config.DBPort, config.DBUser, config.DBPassword, config.DBName)

	if DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{}); err == nil {
		log.Fatalf("Ошибка при подключении в БД: %v", err)
	}

	DB.AutoMigrate(&models.Feature{},
		&models.Feature{},
		&models.Admin{},
		&models.Category{},
		&models.Company{},
		&models.Environment{},
		&models.Event_Type{},
		&models.Enviroment_Feature_Category{},
		&models.Feature_Analytics{},
		&models.Tag{},
		&models.User{},
	)

}

/*
func ConnectToDb(path string) (*Storage, error) {
	db, err := sql.Open("sqlite3", path)

	if err != nil {
		return nil, fmt.Errorf("cant open db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("cant connect to db: %w", err)
	}

	return &Storage{db: db}, err
}
*/

func (s *Storage) Save(ctx context.Context, feature *models.Feature) error {
	q := `INSERT INTO features (name, desc, enabled, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`

	if _, err := s.db.ExecContext(ctx, q, feature.Name, feature.Desc, feature.Enabled, feature.CreatedAt, feature.UpdatedAt); err != nil {
		return fmt.Errorf("cant save feature: %w", err)
	}

	return nil
}

func (s *Storage) Pick(ctx context.Context, name string) (*models.Feature, error) {
	q := `SELECT * FROM features WHERE name = ?`

	var feature models.Feature

	if err := s.db.QueryRowContext(ctx, q, name).Scan(
		&feature.Name,
		&feature.Desc,
		&feature.Enabled,
		&feature.CreatedAt,
		&feature.UpdatedAt,
	); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("feature not found in db: %w", err)
		}
		return nil, fmt.Errorf("cant pick feature: %w", err)
	}
	return &feature, nil
}

func (s *Storage) Remove(ctx context.Context, feature *models.Feature) error {
	q := `DELETE FROM features WHERE name = ?`
	res, err := s.db.ExecContext(ctx, q, feature.Name)
	if err != nil {
		return fmt.Errorf("cant remote feature: %w", err)
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no feature found with name: %s", feature.Name)
	}

	return nil
}

func (s *Storage) IsExists(ctx context.Context, feature *models.Feature) (bool, error) {
	// TODO: Подумать, нужна ли эта проверка везде
	if feature == nil {
		return false, fmt.Errorf("feature cannot be nil")
	}

	q := `SELECT 1 FROM features WHERE name = ?`
	var exists int
	if err := s.db.QueryRowContext(ctx, q, feature.Name).Scan(&exists); err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		return false, fmt.Errorf("cant check if feature exists: %w", err)
	}

	return true, nil
}
func (s *Storage) Update(ctx context.Context, feature *models.Feature) error {
	q := `UPDATE features SET desc = ?, enabled = ?, createdAt = ?, updateAt = ? WHERE name = ?`

	if _, err := s.db.ExecContext(ctx, q, feature.Desc, feature.Enabled, feature.CreatedAt, feature.UpdatedAt); err != nil {
		return fmt.Errorf("cant update feature: %w", err)
	}

	return nil
}
