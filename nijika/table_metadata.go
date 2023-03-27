package main

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func tableMetadataConstraintQuery(ctx context.Context, connID int, table string) ([]constraintsEntity, error) {

	query := `
	SELECT	
		pg_get_constraintdef(con.oid) AS constraint_def
    FROM pg_catalog.pg_constraint con
    INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
    INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
    WHERE nsp.nspname = 'public' AND rel.relname = ` + fmt.Sprintf("'%s'", table)

	result := make([]constraintsEntity, 0)
	rows, err := externalDB[connID].QueryxContext(ctx, query)
	if err != nil && err != sql.ErrNoRows {
		return result, err
	}

	defer rows.Close()
	for rows.Next() {
		var row = constraintsEntity{}
		err = rows.StructScan(&row)
		if err != nil {
			return result, err
		}
		result = append(result, row)
	}

	return result, err
}

func tableMetadataColumnQuery(ctx context.Context, connID int, table string) ([]columnEntity, error) {

	query := `
	SELECT
		c.column_name,
		c.data_type,
		COALESCE(c.character_maximum_length, 0) AS max_length,
		COALESCE(c.character_octet_length, 0) AS octet_length,
		c.is_nullable,
		COALESCE(c.column_default, '') AS column_default
	FROM
		information_schema.columns AS c 
	WHERE
		c.table_name = ` + fmt.Sprintf("'%s'", table)

	result := make([]columnEntity, 0)
	rows, err := externalDB[connID].QueryxContext(ctx, query)
	if err != nil && err != sql.ErrNoRows {
		return result, err
	}

	defer rows.Close()
	for rows.Next() {
		var row = columnEntity{}
		err = rows.StructScan(&row)
		if err != nil {
			return result, err
		}
		result = append(result, row)
	}

	return result, err
}

func tableMetadataIndexQuery(ctx context.Context, connID int, table string) ([]indexEntity, error) {

	query := `
	SELECT
		i.relname AS index_name,
		array_to_string(array_agg(a.attname), ', ') AS column_name
	FROM
		pg_class t,
		pg_class i,
		pg_index ix,
		pg_attribute a
	WHERE
		t.oid = ix.indrelid
		AND i.oid = ix.indexrelid
		AND a.attrelid = t.oid
		AND a.attnum = ANY(ix.indkey)
		AND t.relkind = 'r'
		AND t.relname = ` + fmt.Sprintf("'%s'", table) + ` 
	GROUP BY
		t.relname,
		i.relname`

	result := make([]indexEntity, 0)
	rows, err := externalDB[connID].QueryxContext(ctx, query)
	if err != nil && err != sql.ErrNoRows {
		return result, err
	}

	defer rows.Close()
	for rows.Next() {
		var row = indexEntity{}
		err = rows.StructScan(&row)
		if err != nil {
			return result, err
		}
		result = append(result, row)
	}

	return result, err
}

func tableMetadata(c *fiber.Ctx) error {

	type request struct {
		ConnectionID int    `json:"connection_id"`
		Table        string `json:"table"`
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

	cols, err := tableMetadataColumnQuery(c.Context(), req.ConnectionID, req.Table)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	constrainsts, err := tableMetadataConstraintQuery(c.Context(), req.ConnectionID, req.Table)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	indexes, err := tableMetadataIndexQuery(c.Context(), req.ConnectionID, req.Table)
	if err != nil {
		res.Message = err.Error()
		return c.Status(http.StatusInternalServerError).JSON(res)
	}

	res.Message = "success"
	res.Data = map[string]any{
		"columnns":    cols,
		"constraints": constrainsts,
		"indexes":     indexes,
	}

	return c.Status(http.StatusOK).JSON(res)
}
