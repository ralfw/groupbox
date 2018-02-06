package portals

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/high-value-team/groupbox/backend/src/models"
	"github.com/rs/cors"
)

type HTTPPortal struct {
	Router *chi.Mux
}

func (portal *HTTPPortal) Run(port int) {
	address := fmt.Sprintf(":%d", port)
	handler := cors.AllowAll().Handler(portal)

	log.Println("Starting Webserver, please go to: ", address)
	http.ListenAndServe(address, handler)
}

func (portal *HTTPPortal) ServeHTTP(writer http.ResponseWriter, reader *http.Request) {
	writer.Header().Set("Cache-Control", "no-cache")
	writer.Header().Set("Last-Modified", time.Now().UTC().Format(http.TimeFormat))
	defer handleException(writer)
	portal.Router.ServeHTTP(writer, reader)
}

func handleException(writer http.ResponseWriter) {
	r := recover()
	if r != nil {
		switch ex := r.(type) {
		case models.SadException:
			http.Error(writer, ex.Message(), 404)
		case models.SuprisingException:
			http.Error(writer, ex.Message(), 500)
		default:
			if err, ok := r.(error); !ok {
				http.Error(writer, err.Error(), 500)
			} else {
				http.Error(writer, fmt.Sprintf("%s", r), 500)
			}
		}
	}
}