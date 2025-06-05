package models

type FeatureUsage struct {
	ID                 uint `json:"id" gorm:"primaryKey"`
	FeatureAnalyticsID uint
	FeatureAnalytics   FeatureAnalytics `gorm:"foreignKey:FeatureAnalyticsID"`
	UsageCount         uint             `json:"usageCount"`
	ErrorCount         uint             `json:"errorCount"`
	AvgExecutionTime   float64          `json:"avgExecutionTime"`
}
