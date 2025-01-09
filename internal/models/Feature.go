package models

import "time"

type Feature struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Desc             string    `json:"Desc"`
	Enabled          bool      `json:"enabled"`
	ActivationDate   time.Time `json:"activation_date,omitempty"`
	DeactivationDate time.Time `json:"deactivation_date,omitempty"`
}
