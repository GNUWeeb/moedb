package main

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
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
	app.Use(recover.New())

	app.Get("/connection/:id/connect", connectionConnect)
	app.Delete("/connection/:id/delete", connnectionDelete)
	app.Get("/connection/:id/detail", connectionDetail)
	app.Post("/connection/create", connectionCreate)
	app.Get("/connection/list", connectionList)
	app.Put("/connection/update", connectionUpdate)

	app.Post("/table/list", tableList)
	app.Post("/table/metadata", tableMetadata)

	app.Post("/data/list", dataList)
	app.Post("/data/delete", dataDelete)
	app.Post("/data/batch/delete", dataBatchDelete)
	app.Post("/data/detail", dataDetail)
	app.Put("/data/update", dataUpdate)
	app.Put("/data/batch/update", dataBatchUpdate)
	app.Post("/data/batch/insert", dataBatchInsert)

	app.Post("/raw-query", rawsQuery)

	shutDown := make(chan bool, 1)
	go func() {
		err = app.Listen(":7000")
		shutDown <- true
	}()

	<-shutDown
	fmt.Println("server shutting down")

}
