import {createBrowserRouter, RouterProvider } from "react-router-dom"
import Page from "./pages/Page"
import Interface from "./pages/Interface"
import SignupPage from "./pages/auth/SignupPage"
import SigninPage from "./pages/auth/SigninPage"

function App() {

  const routes = createBrowserRouter([{
    path : "/",
    element : <Page />,
    children : [
      {path:'/', element:<Interface />},
      {path:'/signup', element:<SignupPage />},
      {path:'/signin', element:<SigninPage />},
    ]
  }])

  return (
    <>
      <RouterProvider router={routes}/>
    </>
  )
}

export default App
