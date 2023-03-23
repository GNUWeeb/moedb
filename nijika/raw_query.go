package main

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type rawQueryRequest struct {
	Query        string `json:"query"`
	ConnectionID int    `json:"connection_id"`
}

func rawSQLCommand(ctx context.Context, p rawQueryRequest) error {
	_, err := externalDB[p.ConnectionID].ExecContext(ctx, p.Query)
	return err
}

func rawSQLQuery(ctx context.Context, p rawQueryRequest) ([]map[string]string, []string, error) {
	result := make([]map[string]string, 0)
	col := make([]string, 0)
	conn, ok := externalDB[p.ConnectionID]
	if !ok {
		return result, col, errors.New("connection not found")
	}

	rows, err := conn.QueryxContext(ctx, p.Query)
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

func rawsQuery(c *fiber.Ctx) error {

	req := rawQueryRequest{}
	res := Response{}

	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	if strings.Contains(req.Query, "insert into") || strings.Contains(req.Query, "update from") || strings.Contains(req.Query, "delete from") {
		err := rawSQLCommand(c.Context(), req)
		if err != nil {
			res.Message = err.Error()
			return c.Status(http.StatusInternalServerError).JSON(res)
		}

		res.Message = "success"
		return c.Status(http.StatusOK).JSON(res)

	}
	data, col, err := rawSQLQuery(c.Context(), req)
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
