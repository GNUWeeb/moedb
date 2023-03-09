package main

type connectionEntity struct {
	ID       int    `db:"id"`
	Name     string `db:"name"`
	Driver   string `db:"driver"`
	Host     string `db:"host"`
	Port     int    `db:"port"`
	Database string `db:"database"`
	Username string `db:"username"`
	Password string `db:"password"`
}
