package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func connectionUpdateQuery(ctx context.Context, e connectionEntity) error {
	query := `
		UPDATE connection SET
			name=:name,
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

func connectionUpdate(c *fiber.Ctx) error {

	type request struct {
		ID       int    `json:"id"`
		Name     string `json:"name"`
		Driver   string `json:"driver"`
		Host     string `json:"host"`
		Port     int    `json:"port"`
		Database string `json:"database"`
		Username string `json:"username"`
		Password string `json:"password"`
	}

	req := request{}
	res := response{}

	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	e := connectionEntity(req)
	err = connectionUpdateQuery(c.Context(), e)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
