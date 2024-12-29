package models

type UserFeature struct {
	UserID    int  `json:"user_id"`
	FeatureID int  `json:"feature_id"`
	Enabled   bool `json:"enabled"`
}
