package main

import (
	"embed"
	"log"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:     "2T Launcher PRO",
		Width:     1180,
		Height:    760,
		MinWidth:  900,
		MinHeight: 600,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Bind:      []interface{}{app},
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId: "b2a7e21e-5b74-4af0-8249-2f733f64420e",
			OnSecondInstanceLaunch: func(_ options.SecondInstanceData) {
				wailsruntime.WindowUnminimise(app.ctx)
				wailsruntime.WindowShow(app.ctx)
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}
}
