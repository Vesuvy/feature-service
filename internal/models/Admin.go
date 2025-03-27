package models

import "time"

type Admin struct {
	ID               int       `json:"id"`
	Email            string    `json:"email"`
	Password         string    `json:"password"`
	Company          string    `json:"company"`
	RegistrationDate time.Time `json:"registrationDate"` // дата регистрации админа
}
