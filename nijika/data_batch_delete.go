package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataBatchDeleteQuery(ctx context.Context, connID int, table string, id []any) error {

	tx, err := externalDB[connID].DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := `
		DELETE FROM $1 WHERE id = $2
	`

	for _, v := range id {
		_, err = tx.ExecContext(ctx, query, table, v)
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

func dataBatchDelete(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int    `json:"connection_id"`
		Table        string `json:"table"`
		ID           []any  `json:"id"`
	}

	req := request{}
	res := response{}

	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	err = dataBatchDeleteQuery(c.Context(), req.ConnectionID, req.Table, req.ID)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
