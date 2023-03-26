package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataBatchInsertQuery(ctx context.Context, connID int, table string, e []map[string]any) error {

	columns := ""
	values := ""
	query := "INSERT INTO " + table

	for k := range e[0] {
		columns += k + ","
		values += ":" + k + ","
	}

	columns = columns[:len(columns)-1]
	values = values[:len(values)-1]

	columns = "(" + columns + ")"
	values = " VALUES (" + values + ")"

	query += columns + values
	_, err := externalDB[connID].NamedExecContext(ctx, query, e)
	return err
}

func dataBatchInsert(c *fiber.Ctx) error {

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

	if len(req.Data) <= 0 {
		res.Message = "cannot insert empty data"
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	_, exists := externalDB[req.ConnectionID]
	if !exists {
		res.Message = "connection does not exists, please connect to databse before do operation"
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	err = dataBatchInsertQuery(c.Context(), req.ConnectionID, req.Table, req.Data)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
