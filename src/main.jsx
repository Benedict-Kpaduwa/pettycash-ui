import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PettyCashForm } from "./pages/PettyCashForm.jsx";
import { DisplayForms } from "./pages/DisplayForms.jsx";
import ViewSubmittedRequest from "./pages/ViewSubmittedRequest.jsx";
import CreateUser from "./pages/CreateUser.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthContext } from "./pages/useContext/context.js";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import { useUser } from "./hooks/useUser.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  // const { user, login: setUser } = useAuth();
  const { user } = useUser();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <App />,
    },
    {
      path: "/create-request",
      element: <PettyCashForm />,
    },
    // {
    //   path: "/view-request",
    //   element: <ViewRequest />,
    // },
    {
      path: "/show-requests",
      element: <DisplayForms />,
    },
    {
      path: "/show-requests/:id",
      element: <ViewSubmittedRequest />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/create-account",
      element: <CreateUser />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <div>
      <>
        <AuthContext.Provider value={{ user }}>
          <RouterProvider router={router} />
        </AuthContext.Provider>
      </>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
    <ToastContainer />
  </React.StrictMode>
);
