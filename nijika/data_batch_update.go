package main

import (
	"context"
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

		query := "UPDATE " + table + " SET "
		columns := ""
		condittion := ""

		for k := range v {
			columns += " " + k + "=:" + k + ","

			// NOTE:
			// currently can only update table which has column id

			// TODO:
			// get unique identifier from table meta data
			// for dynamic condition update
			if k == "id" {
				condittion = " WHERE " + k + "=:" + k
			}
		}

		query += columns[:len(columns)-1] + condittion
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

	_, exists := externalDB[req.ConnectionID]
	if !exists {
		res.Message = "connection does not exists, please connect to databse before do operation"
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
