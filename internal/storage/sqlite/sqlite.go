package sqlite

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/Vesuvy/feature-service/internal/models"
)

type Storage struct {
	db *sql.DB
}

func New(path string) (*Storage, error) {
	db, err := sql.Open("sqlite3", path)

	if err != nil {
		return nil, fmt.Errorf("cant open db: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("cant connect to db: %w", err)
	}

	return &Storage{db: db}, err
}

func (s *Storage) Save(ctx context.Context, f *models.Feature) error {
	q := `INSERT INTO features (name, desc, enabled, activationDate, deactivationDate) VALUES (?, ?, ?, ?, ?)`

	if _, err := s.db.ExecContext(ctx, q, f.Name, f.Desc, f.Enabled, f.ActivationDate, f.DeactivationDate); err != nil {
		return fmt.Errorf("cant save feature: %w", err)
	}

	return nil
}
