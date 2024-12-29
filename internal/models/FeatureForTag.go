package models

// Для каких тегов включена конкретная фича
type FeatureForTag struct {
	FeatureID int  `json:"feature_id"`
	TagID     int  `json:"tag_id"`
	Enabled   bool `json:"enabled"`
}
