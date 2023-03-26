package main

import (
	"context"
	"database/sql"
	"net/http"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func rawSQLCommand(ctx context.Context, connID int, query string) (sql.Result, error) {
	return externalDB[connID].ExecContext(ctx, query)
}

func rawSQLQuery(ctx context.Context, connID int, query string) ([]map[string]string, []string, error) {
	result := make([]map[string]string, 0)
	col := make([]string, 0)

	rows, err := externalDB[connID].QueryxContext(ctx, query)
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

	type request struct {
		Query        string `json:"query"`
		ConnectionID int    `json:"connection_id"`
	}

	req := request{}
	res := response{}

	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	_, exists := externalDB[req.ConnectionID]
	if !exists {
		res.Message = "connection does not exists, please connect to databse before do operation"
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	// NOTE:
	// still looking for a better way to detect SQL opeartion is query or command
	q := strings.ToLower(req.Query)
	if strings.Contains("select ", q) {
		data, col, err := rawSQLQuery(c.Context(), req.ConnectionID, req.Query)
		if err != nil {
			res.Message = err.Error()
			return c.Status(http.StatusInternalServerError).JSON(res)
		}

		res.Message = "OK"
		res.Data = map[string]any{
			"op":      "query",
			"values":  data,
			"columns": col,
		}
	}

	sqlResult, err := rawSQLCommand(c.Context(), req.ConnectionID, req.Query)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Data = map[string]any{
		"op":     "command",
		"result": sqlResult,
	}

	res.Message = "success"
	return c.Status(http.StatusOK).JSON(res)
}
