package models

import "time"

type Feature_Analytics struct {
	ID          int       `json:"id"`
	FeatureId   int       `json:"featureId"`
	EventTypeId int       `json:"eventTypeId"`
	StartTime   time.Time `json:"startTime"`
	EndTime     time.Time `json:"endTime"`
	Status      string    `json:"status"`
	Duration    float64   `json:"duration"` // какой тип?
}
