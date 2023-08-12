"use client";
import { ApolloLink, HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import React from "react";

function makeClient() {
  const httpLink = new HttpLink({
    uri: "http://localhost:3000/api/graphql",
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: "no-store" },
  });

  return new NextSSRApolloClient({
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
          // in a SSR environment, if you use multipart features like
          // @defer, you need to decide how to handle these.
          // This strips all interfaces with a `@defer` directive from your queries.
          new SSRMultipartLink({
            stripDefer: true,
          }),
          httpLink,
        ])
        : httpLink,
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider
      makeClient={makeClient}>
      {children}
      </ApolloNextAppProvider>
  );
}