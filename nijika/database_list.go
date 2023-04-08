package main

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func databaseListQuery(ctx context.Context, connID int) ([]string, error) {

	t := []string{}
	query := `
		SELECT datname FROM pg_database
			ORDER BY datname ASC
	`

	rows, err := externalDB[connID].QueryxContext(ctx, query)
	if err != nil && err != sql.ErrNoRows {
		return t, err
	}

	defer rows.Close()
	for rows.Next() {
		var tableName string
		err = rows.Scan(&tableName)
		if err != nil {
			return t, err
		}
		t = append(t, tableName)
	}

	return t, err
}

func databaseList(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int `json:"connection_id"`
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

	t, err := databaseListQuery(c.Context(), req.ConnectionID)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "OK"
	res.Data = t
	return c.Status(http.StatusOK).JSON(res)
}
