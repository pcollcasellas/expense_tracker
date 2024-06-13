import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { UserProvider } from "./context/UserContext.jsx"
import { BrowserRouter } from "react-router-dom"
import { NextUIProvider } from "@nextui-org/react"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <NextUIProvider>
          <main className="dark text-foreground bg-background bg-custom-svg">
            <App />
          </main>
        </NextUIProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
)
