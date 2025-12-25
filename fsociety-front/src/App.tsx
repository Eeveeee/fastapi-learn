import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { Provider } from "react-redux";
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
