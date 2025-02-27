package models

import "time"

type Admin struct {
	ID               int       `json:"id"`
	Email            string    `json:"email"`
	CompanyId        int       `json:"companyId"`
	RegistrationDate time.Time `json:"registrationDate"` // дата регистрации админа
}
