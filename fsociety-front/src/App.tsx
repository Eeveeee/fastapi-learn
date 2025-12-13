import { RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css";
import "./App.css";
import { router } from "./router/router";
import { MantineProvider } from "@mantine/core";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="dark">
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
