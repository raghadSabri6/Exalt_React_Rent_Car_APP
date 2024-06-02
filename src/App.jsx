import MainPage from "./components/MainPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Car from "./pages/car/components/Car";
import History from "./pages/history/components/History";
import CarDetails from "./pages/carDetails/components/CarDetails";
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContextProvider from "./context/User"; 

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainPage />,
      children: [
        {
          path: "/",
          element: <Car />,
        },
        {
          path: "/history",
          element: <History />,
        },
        {
          path: "/carDetails/:id",
          element: <CarDetails />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
      <ToastContainer />
    </>
  );
}

export default App;
