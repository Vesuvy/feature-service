package main

import (
	"fmt"
	"net/http"

	"github.com/Vesuvy/feature-service/internal/config"
	"github.com/go-chi/chi/v5"
)

func main() {
	port := config.GetPort()

	r := chi.NewRouter()
	fmt.Printf("Сервер запущен на порте %s...\n", port)
	err := http.ListenAndServe(":"+port, r)
	if err != nil {
		panic(err)
	}

}
