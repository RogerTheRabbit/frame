package main

import (
	"log"
	"net/http"
	"os/exec"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/enable", getEnableScreen)
	router.GET("/disable", getDisableScreen)

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
