package models

type Category struct {
	ID    int    `json:"id"`
	Title string `json:"tile"`
	Desc  string `json:"desc"`
}

type CategoryRepository interface {
	Create(category *Category) error
	GetAll() ([]Category, error)
	GetByID(id int) (*Category, error)
	Update(category *Category) error
	Delete(id int) error
}
