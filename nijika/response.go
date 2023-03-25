package main

type response struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}
