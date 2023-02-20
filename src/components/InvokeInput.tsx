import { useEffect, useState } from "react";
import {
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
  Select,
} from "@mantine/core";
import { ArrowRight } from "tabler-icons-react";

interface InvokeInputProps {
  hubs: string[];
  onSend: (payload: string, hub: string) => void;
}

export const InvokeInput = ({
  hubs,
  onSend,
  ...props
}: InvokeInputProps & TextInputProps) => {
  const theme = useMantineTheme();
  const [payload, setPayload] = useState<string>("");
  const [hub, setHub] = useState<string | null>("");

  const select = (
    <Select
      radius="xl"
      size="md"
      data={hubs.length ? hubs : ["Selected hub"]}
      value={hubs.length ? hub : "Selected hub"}
      onChange={setHub}
      dropdownPosition="top"
      styles={{
        input: {
          width: 160,
          fontWeight: 500,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
      }}
      disabled={props.disabled || false}
    />
  );

  const submit = () => onSend(payload, hub!);

  useEffect(() => {
    setHub(hubs[0]);
  }, [hubs]);

  return (
    <TextInput
      value={payload}
      onChange={(e) => setPayload(e.currentTarget.value)}
      onKeyDown={(e) => e.key === "Enter" && submit()}
      icon={select}
      iconWidth={172}
      radius="xl"
      size="md"
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
          onClick={submit}
          disabled={props.disabled || false}
        >
          <ArrowRight size={18} />
        </ActionIcon>
      }
      placeholder={'Enter payload in format "Method(arg1, arg2...)"'}
      rightSectionWidth={42}
      styles={{ icon: { pointerEvents: "all", justifyContent: "start" } }}
      {...props}
    />
  );
};
