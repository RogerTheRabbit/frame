package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Note: .env does not override system env vars
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("No .env file, defaulting to server env var", err)
	}
	log.Println("Allowed Origins:", os.Getenv("FRAME_SERVER_ALLOWED_ORIGINS"))

	router := gin.Default()
	router.SetTrustedProxies(nil)
	config := cors.DefaultConfig()
	config.AllowOrigins = strings.Split(os.Getenv("FRAME_SERVER_ALLOWED_ORIGINS"), ",")
	router.Use(cors.New(config))

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
