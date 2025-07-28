"use client";
import React, { useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useInterfaceStore } from "@/state/interface";

function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const { addAlert } = useInterfaceStore((state) => state);
  const [client] = useState(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error: any) => {
          console.log(error);
          const messageTxt =
            error.response && error.response.data.message ? error.response.data.message : error.message;

          addAlert({
            type: "error",
            message: `Error: ${messageTxt}`,
            duration: 5000,
          });
        },
      }),
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
