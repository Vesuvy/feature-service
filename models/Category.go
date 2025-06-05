package models

type Category struct {
	ID        uint    `json:"id" gorm:"primaryKey"`
	Title     string  `json:"title"`
	Desc      string  `json:"desc"`
	CompanyID uint    `json:"companyID"`
	Company   Company `gorm:"foreignKey:CompanyID"`
}
