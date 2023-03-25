package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataUpdateQuery(ctx context.Context, connID int, table string, e map[string]any) error {

	query := fmt.Sprintf("UPDATE %s SET ", table)

	for k := range e {
		query += fmt.Sprintf(" %s=:%s ", k, k)
		if k == "id" {
			query += fmt.Sprintf(" WHERE %s=:%s ", k, k)
		}
	}

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

	err = dataUpdateQuery(c.Context(), req.ConnectionID, req.Table, req.Data)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
