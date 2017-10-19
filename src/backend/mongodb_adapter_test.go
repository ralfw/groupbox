package backend

import (
	"fmt"
	"os"
	"reflect"
	"testing"
)

var ConnectionString string = ""

// export DB_USERNAME="groupbox"
// export DB_PASSWORD="geheim"
// export DB_NAME="develop"
// go test
func TestMain(m *testing.M) {
	username := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	databaseName := os.Getenv("DB_NAME")
	ConnectionString = fmt.Sprintf("mongodb://%s:%s@ds121565.mlab.com:21565/%s", username, password, databaseName)
	os.Exit(m.Run())
}

func TestOpenBoxFound(t *testing.T) {
	// arrange
	adapter := MongoDBAdapter{ConnectionString: ConnectionString}
	adapter.Start()
	defer adapter.Stop()

	// act
	actual := adapter.openBox("1")

	// assert
	expected := &BoxMember{
		BoxKey: "1",
		BoxID:  "litklas",
		Member: Member{
			Email:    "peter@acme.com",
			Nickname: "Golden Panda",
			Owner:    true,
		},
	}
	if !reflect.DeepEqual(expected, actual) {
		t.Errorf("openBox() failed!\nexpected:\n%+v\nactual:\n%+v\n", expected, actual)
	}
}

func TestOpenBoxNOTFound(t *testing.T) {
	// arrange
	adapter := MongoDBAdapter{ConnectionString: ConnectionString}
	adapter.Start()
	defer adapter.Stop()

	// act
	var exception interface{}
	var actual interface{}
	recoverFromPanic(
		func() {
			actual = adapter.openBox("key does not exist")
		},
		func(recovered interface{}) {
			exception = recovered
		},
	)

	// assert
	if _, ok := exception.(SadException); !ok {
		t.Fatal("expected SadException")
	}

	if actual != nil {
		t.Fatal("expected actual to be nil")
	}
}

func TestLoadBoxFound(t *testing.T) {
	// arrange
	adapter := MongoDBAdapter{ConnectionString: ConnectionString}
	adapter.Start()
	defer adapter.Stop()

	// act
	var err error
	actual := adapter.loadBox("litklas")

	// assert
	if err != nil {
		t.Fatal(err)
	}

	expected := &Box{
		BoxID:        "litklas",
		Title:        "Klassiker der Weltliteratur",
		CreationDate: "2017-10-01T10:30:59Z",
		Members: []Member{
			{
				Email:    "peter@acme.com",
				Nickname: "Golden Panda",
				Owner:    true,
			},
			{
				Email:    "paul@acme.com",
				Nickname: "Flying Fox",
				Owner:    false,
			},
			{
				Email:    "mary@acme.com",
				Nickname: "Fierce Tiger",
				Owner:    false,
			},
		},
		Items: []Item{
			{
				CreationDate: "2017-10-01T10:35:20Z",
				Message:      "Die drei Musketiere, Alexandre Dumas",
				Author: Member{
					Email:    "peter@acme.com",
					Nickname: "Golden Panda",
					Owner:    true,
				},
			},
			{
				CreationDate: "2017-10-02T14:40:30Z",
				Message:      "Der Zauberer von Oz, Frank Baum",
				Author: Member{
					Email:    "mary@acme.com",
					Nickname: "Fierce Tiger",
					Owner:    false,
				},
			},
			{
				CreationDate: "2017-10-03T20:55:10Z",
				Message:      "Schuld und Sühne, Dostojewski, www.amazon.de/Schuld-Sühne-Fjodr-Michailowitsch-Dostojewski-ebook/dp/B004UBCWK6",
				Author: Member{
					Email:    "paul@acme.com",
					Nickname: "Flying Fox",
					Owner:    false,
				},
			},
		},
	}
	if !reflect.DeepEqual(expected, actual) {
		t.Errorf("loadBox() failed!\nexpected:\n%+v\nactual:\n%+v\n", expected, actual)
	}
}

func TestLoadBoxNOTFound(t *testing.T) {
	// arrange
	adapter := MongoDBAdapter{ConnectionString: ConnectionString}
	adapter.Start()
	defer adapter.Stop()

	// act
	var exception interface{}
	var actual interface{}
	recoverFromPanic(
		func() {
			actual = adapter.loadBox("key does not exist")
		},
		func(recovered interface{}) {
			exception = recovered
		},
	)

	// assert
	if _, ok := exception.(SadException); !ok {
		t.Fatal("expected SadException")
	}

	if actual != nil {
		t.Fatal("expected actual to be nil")
	}
}

func recoverFromPanic(callback func(), onPanic func(r interface{})) {
	defer func() {
		r := recover()
		if r != nil {
			onPanic(r)
		}
	}()
	callback()
}
