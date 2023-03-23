package main

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func deleteConnectionQuery(ctx context.Context, id int) error {
	query := `
		DELETE FROM connection WHERE id = $1	
	`
	_, err := internalDB.ExecContext(ctx, query, id)
	return err
}

func deleteConnnection(c *fiber.Ctx) error {
	res := Response{}
	idStr := c.Params("id")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	err = deleteConnectionQuery(c.Context(), id)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
