package models

import "time"

type Feature struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	Enabled          bool      `json:"enabled"`
	ActivationDate   time.Time `json:"activation_date,omitempty"`
	DeactivationDate time.Time `json:"deactivation_date,omitempty"`
}
