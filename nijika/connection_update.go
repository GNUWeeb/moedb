package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type updateConnRequest struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Driver   string `json:"driver"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Database string `json:"database"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func updateConnectionQuery(ctx context.Context, e connectionEntity) error {
	query := `
		UPDATE connection SET
			name=:name
			driver=:driver,
			host=:host,
			port=:port,
			database=:database,
			username=:username,
			password=:password
		WHERE id = :id`
	_, err := internalDB.NamedExecContext(ctx, query, e)
	return err
}

func updateConnection(c *fiber.Ctx) error {

	req := updateConnRequest{}
	res := Response{}

	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	e := connectionEntity(req)
	err = updateConnectionQuery(c.Context(), e)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
