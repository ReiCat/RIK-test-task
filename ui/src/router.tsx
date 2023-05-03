import React, { ReactElement } from "react";
import { Route } from "react-router";

import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./pages/ErrorFallback";

export const Router = {
  buildRoutes(
    routes: {
      path: string;
      children?: ReactElement | null;
    }[]
  ) {
    return routes.map(({ path, children }, key) => {
      return (
        <Route
          key={key}
          path={path}
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback} key={path}>
              {children}
            </ErrorBoundary>
          }
        />
      );
    });
  },
};
