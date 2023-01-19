// @ts-ignore
import React from "react";
// @ts-ignore
import ReactDOM from "react-dom";
import App from "./App";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  // @ts-ignore
} from "@tanstack/react-query";

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    retry: 3,
    staleTime: 5000,
    cacheTime: 5000,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    suspense: false,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("_react_components")
);
