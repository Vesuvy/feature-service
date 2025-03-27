package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminCheckMiddleware(c *gin.Context) {
	isAdmin, exists := c.Get("isAdmin")
	if !exists || !isAdmin.(bool) {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "требуется доступ администратора"})
		return
	}
	c.Next()
}
