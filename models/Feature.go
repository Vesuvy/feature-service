package models

import "time"

type Feature struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Title     string    `json:"title"`
	Desc      string    `json:"desc"`
	Enabled   bool      `json:"enabled"`
	CreatedAt time.Time `json:"createdAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt,omitempty"`
	CompanyID uint      `json:"companyID"`
	Company   Company   `gorm:"foreignKey:CompanyID"`
}
