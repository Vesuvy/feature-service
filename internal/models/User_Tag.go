package models

type User_Tag struct {
	ID     int `json:"id"`
	UserId int `json:"userId"`
	TagId  int `json:"tagId"`
}
