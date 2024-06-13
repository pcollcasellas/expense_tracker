import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react"
import axios from "axios"

export const UserContext = createContext()

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("Token"))

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user/", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })

        localStorage.setItem("Token", token)
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setToken(null)
          localStorage.removeItem("Token")
        } else {
          console.error("An error occurred:", error)
        }
      }
      return
    }

    if (token) {
      fetchUser()
    } else {
      localStorage.removeItem("Token")
    }
  }, [token])

  // useEffect(() => {
  //   const fetchMe = async () => {
  //     try {
  //       const response = await axios.get("/api/user/")
  //       setToken(response.data)
  //     } catch (error) {
  //       setToken(null)
  //     }
  //   }

  //   fetchMe()
  // }, [])

  useLayoutEffect(() => {
    const authInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization

      return config
    })

    return () => {
      axios.interceptors.request.eject(authInterceptor)
    }
  }, [token])

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  )
}
