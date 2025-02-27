package models

type Feature_Category struct {
	ID         int `json:"id"`
	FeatureId  int `json:"featureId"`
	CategoryId int `json:"categoryId"`
}
