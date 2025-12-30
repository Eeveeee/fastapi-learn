import "./App.css";
import { AppRouter } from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { Provider } from "react-redux";
import { InitProvider } from "./providers/InitProvider";
const queryClient = new QueryClient();

// TODO: Make all guarded routes depent on /me from authSlice
function App() {
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <InitProvider>
            <AppRouter />
          </InitProvider>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
