package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataListQuery(ctx context.Context, connID int, table string) ([]map[string]string, []string, error) {

	result := make([]map[string]string, 0)
	col := make([]string, 0)
	query := fmt.Sprintf(`SELECT * FROM "%s"`, table)
	conn, ok := externalDB[connID]
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

func dataList(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int    `json:"connection_id"`
		Table        string `json:"table"`
	}

	res := response{}
	req := request{}
	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	data, col, err := dataListQuery(c.Context(), req.ConnectionID, req.Table)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	res.Data = map[string]any{
		"values":  data,
		"columns": col,
	}
	return c.Status(http.StatusOK).JSON(res)
}
