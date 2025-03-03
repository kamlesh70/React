import { RouterProvider } from "react-router-dom"
import router from "./router/router"
import "./App.css";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  // console.log(import.meta, "metadata");

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js", { scope: "./" })
      .then(() => {
        console.log("service worker registered successfully");
      })
      .catch((error) => {
        console.log("getting error while registering service worker", error);
      });
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

export default App
