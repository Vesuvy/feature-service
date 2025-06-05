package models

type EventType struct {
	ID    uint   `json:"id" gorm:"primaryKey"`
	Title string `json:"title"`
	Desc  string `json:"desc"`
}
