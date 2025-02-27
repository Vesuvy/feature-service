package models

type Tag struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Desc      string `json:"desc"`
	CompanyId int    `json:"companyId"`
}
