package main

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func connectionDetailQuery(ctx context.Context, id int) (connectionEntity, error) {

	conns := connectionEntity{}
	query := "SELECT * FROM connection WHERE id = $1"

	row := internalDB.QueryRowxContext(ctx, query, id)
	err := row.StructScan(&conns)
	if err != nil {
		return conns, err
	}
	return conns, err
}

func connectionDetail(c *fiber.Ctx) error {

	res := response{}
	id, err := c.ParamsInt("id")
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	conns, err := connectionDetailQuery(c.Context(), id)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}
	res.Message = "success"
	res.Data = connectionPresenter(conns)

	return c.Status(http.StatusOK).JSON(res)
}
