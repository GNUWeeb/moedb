package main

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func connectionListQuery(ctx context.Context) ([]connectionEntity, error) {

	conns := []connectionEntity{}
	query := "SELECT * FROM connection"

	rows, err := internalDB.QueryxContext(ctx, query)
	if err != nil && err != sql.ErrNoRows {
		return conns, err
	}

	defer rows.Close()
	for rows.Next() {
		conn := connectionEntity{}
		err := rows.StructScan(&conn)
		if err != nil {
			return conns, err
		}
		conns = append(conns, conn)
	}

	return conns, err
}

func connectionList(c *fiber.Ctx) error {

	res := response{}
	conns, err := connectionListQuery(c.Context())
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	resData := []connectionPresenter{}
	for _, v := range conns {
		resData = append(resData, connectionPresenter(v))
	}

	res.Message = "success"
	res.Data = resData

	return c.Status(http.StatusOK).JSON(res)
}
