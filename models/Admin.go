package models

import (
	"time"
)

type Admin struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	Email            string    `json:"email"`
	Password         string    `json:"password"`
	CompanyID        uint      `json:"company"`
	Company          Company   `gorm:"foreignKey:CompanyID"`
	RegistrationDate time.Time `json:"registrationDate"`
}
