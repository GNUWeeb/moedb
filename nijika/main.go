package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/jmoiron/sqlx"
	_ "github.com/mattn/go-sqlite3"
)

var (
	externalDB = make(map[int]*sqlx.DB)
	internalDB *sqlx.DB
)

func main() {

	app := fiber.New()

	db, err := sqlx.Open("sqlite3", "sql.db")
	if err != nil {
		panic(err)
	}

	internalDB = db
	_, err = db.Exec(`
				CREATE TABLE IF NOT EXISTS connection (
					id INTEGER PRIMARY KEY AUTOINCREMENT, 
					name VARCHAR(255),
					driver VARCHAR(50),
					host VARCHAR(255),
					port INTEGER,
					database VARCHAR(255),
					username VARCHAR(255),
					password VARCHAR(255)
				)`,
	)

	if err != nil {
		panic(err)
	}

	app.Use(cors.New())
	app.Use(logger.New())

	app.Get("/connection/:id/connect", connectionConnect)
	app.Delete("/connection/:id", deleteConnnection)
	app.Post("/connection", createConnection)
	app.Get("/connection", connectionGetList)
	app.Put("/connection", updateConnection)
	app.Get("/table/:connection_id", tableGetList)
	app.Post("/data", dataGetList)

	app.Listen(":7000")

}
