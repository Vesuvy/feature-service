package models

import "time"

type FeatureAnalytics struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	FeatureID   uint      `json:"featureID"`
	feature     Feature   `gorm:"foreignKey:FeatureID"`
	EventTypeID uint      `json:"eventTypeID"`
	EventType   EventType `gorm:"foreignKey:EventTypeID"`
	StartTime   time.Time `json:"startTime"`
	EndTime     time.Time `json:"endTime"`
	Status      string    `json:"status"`
	Duration    float64   `json:"duration"`
	CompanyID   uint      `json:"companyID"`
	Company     Company   `gorm:"foreignKey:CompanyID"`
}
