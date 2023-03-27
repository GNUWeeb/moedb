package main

type columnEntity struct {
	ColumnName     string `db:"column_name" json:"column_name"`
	DataType       string `db:"data_type" json:"columns_name"`
	ColumnDefault  string `db:"column_default" json:"column_default"`
	IsNullable     string `db:"is_nullable" json:"is_nullable"`
	MaxLength      int    `db:"max_length" json:"max_length"`
	OctetLength    int    `db:"octet_length" json:"octet_lenght"`
	ConstraintType string `db:"constraint_type" json:"constraint_type"`
	ConstraintName string `db:"constraint_name" json:"constraint_name"`
}

type constraintsEntity struct {
	ConstraintDef string `db:"constraint_def" json:"constraint_def"`
}

type indexEntity struct {
	ColumnName string `db:"column_name" json:"column_name"`
	IndexName  string `db:"index_name" json:"index_name"`
}
