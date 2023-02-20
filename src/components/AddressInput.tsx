import { useEffect, useState } from "react";
import { TextInput, TextInputProps, ActionIcon, useMantineTheme } from "@mantine/core";
import { ArrowRight, PlayerStop, PlugConnected } from "tabler-icons-react";

const LS_ADDRESS_TOKEN = "app_conn_address";

interface AddressInputProps {
  isConnected: boolean;
  onConnect: (addr: string | null) => void;
}

export const AddressInput = ({
  isConnected,
  onConnect,
  ...props
}: AddressInputProps & TextInputProps) => {
  const theme = useMantineTheme();
  const [address, setAddress] = useState<string>(
    localStorage.getItem(LS_ADDRESS_TOKEN) || ""
  );

  useEffect(() => {
    if (!isConnected) return;
    localStorage.setItem(LS_ADDRESS_TOKEN, address);
  }, [isConnected]);

  return (
    <TextInput
      value={address}
      onChange={(e) => setAddress(e.currentTarget.value)}
      icon={<PlugConnected size={18} strokeWidth={1.5} />}
      radius="xl"
      size="md"
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={!isConnected ? theme.primaryColor : "red"}
          variant="filled"
          onClick={() => onConnect(!isConnected ? address || null : null)}
        >
          {isConnected ? (
            <PlayerStop fill="white" size={18} />
          ) : (
            <ArrowRight size={18} />
          )}
        </ActionIcon>
      }
      placeholder={'Enter address in format "http://address:port/signalr/{hub1,hub2}"'}
      rightSectionWidth={42}
      disabled={isConnected}
      {...props}
    />
  );
};
