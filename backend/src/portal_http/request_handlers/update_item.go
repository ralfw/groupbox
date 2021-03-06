package request_handlers

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/high-value-team/groupbox/backend/src/interior_interactions"
)

type UpdateItem struct {
	Interactions *interior_interactions.Interactions
}

func NewUpdateItemHandler(interactions *interior_interactions.Interactions) http.HandlerFunc {
	updateItem := UpdateItem{Interactions: interactions}
	return updateItem.Handle
}

func (handler *UpdateItem) Handle(writer http.ResponseWriter, reader *http.Request) {
	boxKey := chi.URLParam(reader, "boxKey")
	itemID := chi.URLParam(reader, "itemID")
	jsonRequest := JSONRequestUpdateItem{}
	parseRequestBody(reader, &jsonRequest)
	handler.Interactions.UpdateItem(boxKey, itemID, jsonRequest.Subject, jsonRequest.Message)
}
