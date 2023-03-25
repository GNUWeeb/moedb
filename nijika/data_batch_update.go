package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataBatchUpdateQuery(ctx context.Context, connID int, table string, e []map[string]any) error {

	tx, err := externalDB[connID].BeginTxx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	for _, v := range e {
		query := fmt.Sprintf("UPDATE %s SET ", table)
		for k := range v {
			query += fmt.Sprintf(" %s=:%s ", k, k)
			if k == "id" {
				query += fmt.Sprintf(" WHERE %s=:%s ", k, k)
			}
		}

		_, err = tx.NamedExecContext(ctx, query, v)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return err
}

func dataBatchUpdate(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int              `json:"connection_id"`
		Table        string           `json:"table"`
		Data         []map[string]any `json:"data"`
	}

	req := request{}
	res := response{}

	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	err = dataBatchUpdateQuery(c.Context(), req.ConnectionID, req.Table, req.Data)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
