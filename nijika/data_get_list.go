package main

import (
	"context"
	"database/sql"
	"errors"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

type dataGetListRequest struct {
	ConnectionID int    `json:"connection_id"`
	Table        string `json:"table"`
}

func dataGetListQuery(ctx context.Context, p dataGetListRequest) ([]map[string]string, []string, error) {

	result := make([]map[string]string, 0)
	col := make([]string, 0)
	query := "SELECT * FROM " + p.Table
	conn, ok := externalDB[p.ConnectionID]
	if !ok {
		return result, col, errors.New("connection not found")
	}

	rows, err := conn.QueryxContext(ctx, query)
	if err != nil && err != sql.ErrNoRows {
		return result, col, err
	}

	cols, err := rows.Columns()
	if err != nil {
		return result, col, err
	}

	mCol := make(map[int]string, len(cols))
	mVal := make(map[string]string, len(cols))
	row := make([][]byte, len(cols))
	rowPtr := make([]any, len(cols))

	for i := range row {
		rowPtr[i] = &row[i]
		mCol[i] = cols[i]
	}

	defer rows.Close()
	for rows.Next() {

		err = rows.Scan(rowPtr...)
		if err != nil {
			return result, col, err
		}

		for i, v := range row {
			key := mCol[i]
			mVal[key] = string(v)
		}

		result = append(result, mVal)
		mVal = make(map[string]string, len(cols))
	}

	return result, cols, err
}

func dataGetList(c *fiber.Ctx) error {

	res := Response{}
	req := dataGetListRequest{}
	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	data, col, err := dataGetListQuery(c.Context(), req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "OK"
	res.Data = map[string]any{
		"values":  data,
		"columns": col,
	}
	return c.Status(http.StatusOK).JSON(res)
}
