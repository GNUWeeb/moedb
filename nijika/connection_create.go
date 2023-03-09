package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
)

type createConnectionRequest struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Driver   string `json:"driver"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Database string `json:"database"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func createConnectionQuery(ctx context.Context, e connectionEntity) error {
	query := `INSERT INTO connection (
		name,
		driver,
		host,
		port,
		database,
		username,
		password
	) VALUES (:name, :driver, :host, :port, :database, :username, :password)`
	_, err := internalDB.NamedExecContext(ctx, query, e)
	return err
}

func createConnection(c *fiber.Ctx) error {

	req := createConnectionRequest{}
	res := Response{}
	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	e := connectionEntity(req)

	err = createConnectionQuery(c.Context(), e)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
