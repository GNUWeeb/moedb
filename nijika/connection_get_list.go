package main

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type getConnectionResponse struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Driver   string `json:"driver"`
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Database string `json:"database"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func connectionGetListQuery(ctx context.Context) ([]connectionEntity, error) {

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

func connectionGetList(c *fiber.Ctx) error {

	res := Response{}
	conns, err := connectionGetListQuery(c.Context())
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	resData := []getConnectionResponse{}
	for _, v := range conns {
		resData = append(resData, getConnectionResponse(v))
	}

	res.Message = "OK"
	res.Data = resData

	return c.Status(http.StatusOK).JSON(res)
}
