package main

import (
	"context"
	"database/sql"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func tableGetListQuery(ctx context.Context, connID int) ([]string, error) {

	t := []string{}
	query := `
			SELECT tablename FROM pg_catalog.pg_tables
				WHERE schemaname != 'pg_catalog' 
				AND schemaname != 'information_schema'
			ORDER BY tablename ASC
		`

	conn, exists := externalDB[connID]
	if !exists {
		return t, errors.New("connection not found")
	}

	rows, err := conn.QueryxContext(ctx, query)
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

func tableGetList(c *fiber.Ctx) error {

	res := Response{}
	id, err := c.ParamsInt("connection_id")
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	t, err := tableGetListQuery(c.Context(), id)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "OK"
	res.Data = t
	return c.Status(http.StatusOK).JSON(res)
}
