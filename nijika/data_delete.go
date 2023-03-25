package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataDeleteQuery(ctx context.Context, connID int, table string, id any) error {
	query := `
		DELETE FROM $1 WHERE id = $1	
	`
	_, err := externalDB[connID].ExecContext(ctx, query, table, id)
	return err
}

func dataDelete(c *fiber.Ctx) error {

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

	err = dataDeleteQuery(c.Context(), req.ConnectionID, req.Table, req.ID)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
