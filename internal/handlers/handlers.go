package handlers

import "github.com/gin-gonic/gin"

func InitHandlers(r *gin.Engine) {
	r.GET("/features/:featureName/:userID/:groupName", GetFeatureState)
	r.POST("/features/update", UpdateFeatureState)
	r.POST("/features/log", LogFeatureUsage)
	r.POST("/features/metric", RecordFeatureMetric)
	r.POST("/features", CreateFeature)
	r.GET("/features", GetFeatures)
}

func GetFeatureState(context *gin.Context) {

}

func GetFeatures(context *gin.Context) {

}

func CreateFeature(context *gin.Context) {

}

func RecordFeatureMetric(context *gin.Context) {

}

func LogFeatureUsage(context *gin.Context) {

}

func UpdateFeatureState(context *gin.Context) {

}
