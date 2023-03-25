package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func connectionConnectQuery(ctx context.Context, connID int) (connectionEntity, error) {

	e := connectionEntity{}
	query := "SELECT * FROM connection WHERE id = $1 LIMIT 1"
	row := internalDB.QueryRowxContext(ctx, query, connID)

	err := row.StructScan(&e)
	if err != nil {
		return e, err
	}

	return e, err
}

func connectionConnect(c *fiber.Ctx) error {

	res := response{}
	id, err := c.ParamsInt("id")
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	e, err := connectionConnectQuery(c.Context(), id)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	if _, exists := externalDB[e.ID]; !exists {
		strConn := fmt.Sprintf("%s://%s:%s@%s/%s?sslmode=disable", e.Driver, e.Username, e.Password, e.Host, e.Database)
		conn, err := sqlx.Open(e.Driver, strConn)
		if err != nil {
			res.Message = err.Error()
			return c.Status(http.StatusInternalServerError).JSON(res)
		}
		externalDB[e.ID] = conn
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
