import {createBrowserRouter, RouterProvider } from "react-router-dom"
import Page from "./pages/Page"
import Interface from "./pages/Interface"
import SignupPage from "./pages/auth/SignupPage"
import SigninPage from "./pages/auth/SigninPage"
import NewProjectPage from "./pages/NewProjectPage"
import OnboardingForm from "./pages/Onboarding"
import ProjectDetail from "./pages/ProjectDetails"
import Profile from "./pages/Profile"

function App() {

  const routes = createBrowserRouter([{
    path : "/",
    element : <Page />,
    children : [
      {path:'/', element:<Interface />},
      {path:'/signup', element:<SignupPage />},
      {path:'/signin', element:<SigninPage />},
      {path:'/onboarding', element:<OnboardingForm />},
      {path:'/newproject', element:<NewProjectPage />},
      {path:'/project/:id', element:<ProjectDetail />},
      {path:'/profile/:username', element:<Profile />},
    ]
  }])

  return (
    <>
      <RouterProvider router={routes}/>
    </>
  )
}

export default App
