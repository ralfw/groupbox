package main

//go:generate go run frontend/util/generator/generator.go

import (
	"github.com/high-value-team/groupbox/src/backend"
)

// wird durch build.sh gesetzt
var VersionNumber string = ""

func main() {
	cliParams := NewCLIParams(VersionNumber)
	mongoDBAdapter := backend.MongoDBAdapter{ConnectionString: cliParams.MongoDBURL}
	mongoDBAdapter.Start()
	defer mongoDBAdapter.Stop()
	emailNotifications := backend.EmailNotifications{
		Domain:            cliParams.Domain,
		NoReplyEmail:      cliParams.SMTPNoReplyEmail,
		SMTPServerAddress: cliParams.SMTPServerAddress,
		Username:          cliParams.SMTPUsername,
		Password:          cliParams.SMTPPassword,
	}

	interactions := backend.NewInteractions(&mongoDBAdapter, &emailNotifications)
	requestHandlers := []backend.RequestHandler{
		&backend.AddItemRequestHandler{Interactions: interactions},
		&backend.CreateBoxRequestHandler{Interactions: interactions},
		&backend.GetBoxRequestHandler{Interactions: interactions},
		&backend.VersionRequestHandler{VersionNumber: VersionNumber},
		&backend.StaticRequestHandler{},
	}
	httpPortal := backend.HTTPPortal{RequestHandlers: requestHandlers}
	httpPortal.Run(cliParams.Port)
}
