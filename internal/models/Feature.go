package models

import "time"

type Feature struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Desc      string    `json:"Desc"`
	Enabled   bool      `json:"enabled"`
	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
}
