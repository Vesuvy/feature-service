package models

type User struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	Name      string  `json:"name"`
	TagIDs    string  `json:"tag_ids"`
	CompanyID uint    `json:"company"`
	Company   Company `gorm:"foreignKey:CompanyID"`
}
