package main

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func dataListQuery(ctx context.Context, connID int, table, search, orderBy, orderType string, limit, offset int) ([]map[string]string, []string, error) {

	result := make([]map[string]string, 0)
	col := make([]string, 0)
	query := fmt.Sprintf(`SELECT * FROM "%s" %s `, table, search)

	if orderBy != "" && orderType != "" {
		query += " ORDER BY " + orderBy + " " + orderType
	}
	query += " LIMIT " + fmt.Sprint(limit) + " OFFSET " + fmt.Sprint(offset)
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

func dataCountQuery(ctx context.Context, connID int, table, search string) (int64, error) {
	count := int64(0)
	query := fmt.Sprintf(`SELECT count(*) FROM "%s" %s`, table, search)
	row := externalDB[connID].QueryRowxContext(ctx, query)
	err := row.Scan(&count)
	return count, err
}

func dataList(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int    `json:"connection_id"`
		Table        string `json:"table"`
		Search       string `json:"search"`
		Page         int    `json:"page"`
		Limit        int    `json:"limit"`
		OrderBy      string `json:"order_by"`
		OrderType    string `json:"order_type"`
	}

	res := response{}
	req := request{}
	err := c.BodyParser(&req)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	if req.Page <= 0 {
		req.Page = 1
	}

	if req.Limit <= 0 {
		req.Limit = 10
	}

	offset := (req.Page - 1) * req.Limit

	_, exists := externalDB[req.ConnectionID]
	if !exists {
		res.Message = "connection does not exists, please connect to databse before do operation"
		return c.Status(http.StatusBadRequest).JSON(res)
	}

	data, col, err := dataListQuery(c.Context(), req.ConnectionID, req.Table, req.Search, req.OrderBy, req.OrderType, req.Limit, offset)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	total, err := dataCountQuery(c.Context(), req.ConnectionID, req.Table, req.Search)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	res.Data = map[string]any{
		"values":  data,
		"columns": col,
	}
	res.Pagination = map[string]any{
		"total_data":  total,
		"page":        req.Page,
		"total_pages": total/int64(req.Limit) + 1,
		"limit":       req.Limit,
	}

	return c.Status(http.StatusOK).JSON(res)
}
