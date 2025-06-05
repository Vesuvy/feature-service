package models

type FeatureAvailability struct {
	ID            uint `json:"id" gorm:"primaryKey"`
	TagID         uint
	Tag           Tag `gorm:"foreignKey:TagID"`
	FeatureID     uint
	Feature       Feature `gorm:"foreignKey:FeatureID"`
	EnvironmentID uint
	Environment   Environment `gorm:"foreignKey:EnvironmentID"`
	IsActive      bool
}
