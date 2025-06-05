package models

type FeatureCategory struct {
	ID         uint     `json:"id" gorm:"primaryKey"`
	FeatureID  uint     `json:"featureID"`
	Feature    Feature  `gorm:"foreignKey:FeatureID"`
	CategoryID uint     `json:"categoryID"`
	Category   Category `gorm:"foreignKey:CategoryID"`
}
