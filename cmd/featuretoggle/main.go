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

	//(пока для примера)
	// Роуты для фич
	r.Route("/features", func(r chi.Router) {
		r.Get("/", listFeatures)         // Получить список всех фич
		r.Post("/", createFeature)       // Создать новую фичу
		r.Get("/{id}", getFeature)       // Получить фичу по ID
		r.Put("/{id}", updateFeature)    // Обновить фичу
		r.Delete("/{id}", deleteFeature) // Удалить фичу
	})

	// Роуты для категорий
	r.Route("/category", func(r chi.Router) {
		r.Get("/", listCategories)        // Получить список всех категорий
		r.Post("/", createCategory)       // Создать новую категорию
		r.Get("/{id}", getCategory)       // Получить категорию по ID
		r.Put("/{id}", updateCategory)    // Обновить категорию
		r.Delete("/{id}", deleteCategory) // Удалить категорию
	})

	fmt.Printf("Сервер запущен на порте %s...\n", port)
	err := http.ListenAndServe(":"+port, r)

	if err != nil {
		panic(err)
	} // Инициализация chi
}

// Хендлеры для фич

func listFeatures(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Хендлер listFeatures выполнился: Список всех фич"))
}

func createFeature(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Хендлер createFeature выполнился: Новая фича создана"))
}

func getFeature(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	w.Write([]byte("Хендлер getFeature выполнился: Получена фича с ID = " + id))
}

func updateFeature(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	w.Write([]byte("Хендлер updateFeature выполнился: Фича с ID = " + id + " обновлена"))
}

func deleteFeature(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	w.Write([]byte("Хендлер deleteFeature выполнился: Фича с ID = " + id + " удалена"))
}

// Хендлеры для категорий

func listCategories(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Хендлер listCategories выполнился: Список всех категорий"))
}

func createCategory(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Хендлер createCategory выполнился: Новая категория создана"))
}

func getCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	w.Write([]byte("Хендлер getCategory выполнился: Получена категория с ID = " + id))
}

func updateCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	w.Write([]byte("Хендлер updateCategory выполнился: категория с ID = " + id + " обновлена"))
}

func deleteCategory(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	w.Write([]byte("Хендлер deleteCategory выполнился: Категория с ID = " + id + " удалена"))
}
