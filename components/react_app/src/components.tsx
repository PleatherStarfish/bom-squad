import React from "react";
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
    staleTime: 2000,
    cacheTime: 2000,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    refetchOnReconnect: "always",
    refetchInterval: 2000,
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
