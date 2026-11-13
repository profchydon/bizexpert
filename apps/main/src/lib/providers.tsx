"use client";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { RouteProvider } from "@/providers/router-provider";
import { Theme } from "@/providers/theme";
import { reduxStore } from "../store";

persistStore(reduxStore);

export const Providers = (props: React.PropsWithChildren) => {
  return (
    <Provider store={reduxStore}>
      <RouteProvider>
        <Theme>{props.children}</Theme>
      </RouteProvider>
    </Provider>
  );
};
