package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataDetailQuery(ctx context.Context, connID int, table string, id any) (map[string]any, []string, error) {

	result := make(map[string]any, 0)
	col := make([]string, 0)
	query := "SELECT * FROM $1 WHERE id = $2"

	row := externalDB[connID].QueryRowxContext(ctx, query)
	cols, err := row.Columns()
	if err != nil {
		return result, col, err
	}

	err = row.MapScan(result)
	return result, cols, err
}

func dataDetail(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int    `json:"connection_id"`
		Table        string `json:"table"`
		ID           any    `json:"id"`
	}

	req := request{}
	res := response{}

	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	_, exists := externalDB[req.ConnectionID]
	if !exists {
		res.Message = "connection does not exists, please connect to databse before do operation"
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	result, cols, err := dataDetailQuery(c.Context(), req.ConnectionID, req.Table, req.ID)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	res.Data = map[string]any{
		"columns": cols,
		"values":  result,
	}

	return c.Status(http.StatusOK).JSON(res)
}
