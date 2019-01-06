package main

import (
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("guest portal"))
	})
	addr := ":3002"
	fmt.Println("listen on ", addr)
	http.ListenAndServe(addr, mux)
}
