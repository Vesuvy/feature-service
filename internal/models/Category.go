package models

type Category struct {
	ID    int    `json:"id"`
	Title string `json:"tile"`
	Desc  string `json:"desc"`
}
