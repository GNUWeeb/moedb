package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataUpdateQuery(ctx context.Context, connID int, table string, e map[string]any) error {

	query := "UPDATE " + table + " SET "
	columns := ""
	condittion := ""

	for k := range e {
		columns += " " + k + "=:" + k + ","
		// NOTE:
		// currently can only delete table which has column id
		if k == "id" {
			condittion = " WHERE " + k + "=:" + k
		}
	}

	query += columns[:len(columns)-1] + condittion
	_, err := externalDB[connID].NamedExecContext(ctx, query, e)
	return err
}

func dataUpdate(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int            `json:"connection_id"`
		Table        string         `json:"table"`
		Data         map[string]any `json:"data"`
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

	err = dataUpdateQuery(c.Context(), req.ConnectionID, req.Table, req.Data)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
