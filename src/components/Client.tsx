import { useEffect, useRef, useState } from "react";
import { Group, Stack, Textarea, Container } from "@mantine/core";
import { Connection, hubConnection, Proxy } from "signalr-no-jquery-updated";

import { AddressInput } from "./AddressInput";
import { InvokeInput } from "./InvokeInput";

export const Client = () => {
  const [connStatus, setConnStatus] = useState<"idle" | "connecting" | "connected">(
    "idle"
  );
  const [address, setAddress] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [hubs, setHubs] = useState<string[]>([]);
  const connRef = useRef<Connection | null>(null);

  const invoke = (payload: string, hubId: string) => {
    const [method, ...rawArgs] = payload.split("(");
    if (!method) {
      setMessages((x) => [...x, formatLogMsg("Error: could not parse payload")]);
      return;
    }

    const argsStr = rawArgs.join("");
    const idx = argsStr.lastIndexOf(")");
    const args = argsStr
      .slice(0, idx)
      .split(",")
      .map((x) => x.trim());

    const hub = connRef.current?.proxies[hubId] as Proxy;
    if (!hub) return;

    const res = hub.invoke(method, ...args) as any;
    res
      .done((res: unknown) => {
        setMessages((x) => [
          ...x,
          formatLogMsg(
            res
              ? `(Invoke) ${JSON.stringify(res)}`
              : "Invoke executed successfully, no respononse received.",
            hubId
          ),
        ]);
      })
      .fail((err: string) => {
        setMessages((x) => [...x, formatLogMsg(err.toString())]);
      });
  };

  useEffect(() => {
    if (!address) return;
    setHubs([]);

    const [rawBasePath, hubsStr] = address.split("{");
    const basePath = rawBasePath.endsWith("/")
      ? rawBasePath.slice(0, rawBasePath.length - 1)
      : rawBasePath;
    if (!hubsStr) {
      setMessages((x) => [...x, formatLogMsg("Error: hub not specified")]);
      return;
    }

    const hubs = hubsStr.replace("}", "").split(",");
    if (!hubs.length) {
      setMessages((x) => [...x, formatLogMsg("Error: hub not specified")]);
      return;
    }

    const con = hubConnection(basePath, {
      useDefaultPath: false,
    });
    connRef.current = con;

    hubs.forEach((x) => {
      const hub = con.createHubProxy(x);
      (hub.connection as any).events.onReceived.push((_: any, payload: any) => {
        if (payload.I) return;
        if (!payload.A)
          return console.warn(
            `Unknown response type {${Object.keys(payload).map(
              (x) => `${x}: ${typeof payload[x]}`
            )}}`
          );
        setMessages((x) => [
          ...x,
          formatLogMsg(`(${payload.M}) ${JSON.stringify(payload.A)}\n`, payload.H),
        ]);
      });
    });
    setHubs(hubs);

    setMessages((x) => [...x, formatLogMsg(`Connecting to "${basePath}"`)]);
    setConnStatus("connecting");
    con
      .start()
      .done((conn: any) => {
        setMessages((x) => [...x, formatLogMsg("Connected, connection ID=" + conn.id)]);
        setConnStatus("connected");
      })
      .fail(() => {
        setMessages((x) => [...x, formatLogMsg("Error: could not connect")]);
        setConnStatus("idle");
      });

    return () => con.stop();
  }, [address]);

  return (
    <Container pt="xl" h="100%">
      <Stack h="100%">
        <Group w="75%" mx="auto" grow>
          <AddressInput
            isConnected={connStatus !== "idle"}
            onConnect={(val) => {
              if (!val) {
                connRef.current?.stop();
                connRef.current = null;
                setConnStatus("idle");
              } else {
                setMessages([]);
              }

              setAddress(val);
            }}
          />
        </Group>
        <Textarea
          value={messages.join("\n")}
          minRows={14}
          maxRows={30}
          autosize
          readOnly
        />
        <InvokeInput hubs={hubs} onSend={invoke} disabled={connStatus !== "connected"} />
      </Stack>
    </Container>
  );
};

const formatLogMsg = (payload: string | unknown, hub?: string) => {
  const now = new Date().toLocaleTimeString();
  const msg = typeof payload === "string" ? payload : JSON.stringify(payload);
  return `[${now}]${hub ? ` {${hub}} ` : " "}${msg}`;
};
