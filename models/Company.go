package models

type Company struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Title string `json:"title"`
}
