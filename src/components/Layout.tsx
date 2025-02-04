import {
  AppShell,
  Badge,
  Burger,
  Group,
  Input,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { matchSorter } from "match-sorter";
import { ReactNode, useMemo, useState } from "react";
import { Place, places } from "../data";
import { IconHeartFilled } from "@tabler/icons-react";

interface LayoutProps {
  children: ReactNode;
  onSelect: (place: Place) => void;
}

export const Layout = ({ children, onSelect }: LayoutProps) => {
  const theme = useMantineTheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const visiblePlaces = useMemo(() => matchSorter(places, search, { keys: ["title"] }), [search]);

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <IconHeartFilled color={theme.colors.red[7]} size={30} />

          <Text size="xl" fw={900} visibleFrom="sm">
            Diaspora Stands with Students
          </Text>

          <Text size="md" fw={900} hiddenFrom="sm">
            Diaspora Stands with Students
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Stack p="md">
          <Input placeholder="Pronađi mesto..." value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
        </Stack>

        <ScrollArea>
          {visiblePlaces.map((place, index) => (
            <NavLink
              key={index}
              href="#"
              label={place.city}
              description={place.country}
              onClick={() => {
                onSelect(place);
                close();
              }}
              leftSection={
                <Badge size="xs" color="blue" circle>
                  {place.events.length}
                </Badge>
              }
            />
          ))}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
