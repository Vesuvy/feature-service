package models

type Using_Feature struct {
	ID        int `json:"id"`
	UserId    int `json:"userId"`
	FeatureId int `json:"featureId"`
}
