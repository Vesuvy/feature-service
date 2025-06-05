package models

type Environment struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Title string `json:"title"`
}
