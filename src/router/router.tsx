import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../layouts/Dashboard";
import Home from "../pages/home/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "/router-dom",
                element: <h1>React Router Dom</h1>
            }
        ]
    }
])

export default router;