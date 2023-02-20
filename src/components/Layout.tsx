import { PropsWithChildren } from "react";
import {
  ActionIcon,
  AppShell,
  Code,
  Container,
  Group,
  Header,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";

import pkg from "../../package.json";

export const Layout = ({ children }: PropsWithChildren) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs">
          <Container style={{ height: "100%" }}>
            <Group position="apart" style={{ height: "100%" }}>
              <Group>
                <Title order={3}>SignalR Client</Title>
                <Code>{pkg.version}</Code>
              </Group>

              <ActionIcon
                size={32}
                variant="outline"
                color={colorScheme === "dark" ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {colorScheme === "dark" ? <Sun size={22} /> : <MoonStars size={22} />}
              </ActionIcon>
            </Group>
          </Container>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};
