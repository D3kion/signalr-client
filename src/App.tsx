import { useState } from "react";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";

import { Layout } from "./components/Layout";
import { Client } from "./components/Client";

const LS_THEME_TOKEN = "app_theme";

export default function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    (localStorage.getItem(LS_THEME_TOKEN) as ColorScheme) || "light"
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const next = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(next);
    localStorage.setItem(LS_THEME_TOKEN, next);
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Layout>
          <Client />
        </Layout>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
