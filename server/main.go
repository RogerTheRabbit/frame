package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/enable", getEnableScreen)
	router.GET("/disable", getDisableScreen)

	api := router.Group("/api")
	{
		api.GET("/hass-config", getHassConfig)
	}

	router.GET("/")

	router.Run("0.0.0.0:8080")
}

func getEnableScreen(c *gin.Context) {
	cmd := exec.Command("sway", "output", "\"HDMI-A-1\"", "enable")

	err := cmd.Run()

	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusOK)
}

func getDisableScreen(c *gin.Context) {
	cmd := exec.Command("sway", "output", "\"HDMI-A-1\"", "disable")

	err := cmd.Run()

	if err != nil {
		log.Println(err)
		c.Status(http.StatusInternalServerError)
		return
	}

	c.Status(http.StatusOK)
}

func getHassConfig(c *gin.Context) {
	content, err := os.ReadFile("hass-config.json")
	if err != nil {
		log.Println("Error reading hass-config.json: ", err)
		c.String(500, err.Error())
		return
	}

	var payload map[string]interface{}
	err = json.Unmarshal(content, &payload)
	if err != nil {
		log.Println("Error during Unmarshal(): ", err)
		c.String(500, "Error during Unmarshal(): ", err)
	}

	c.JSON(200, payload)
}
