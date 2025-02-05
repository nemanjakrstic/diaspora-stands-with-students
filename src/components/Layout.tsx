import {
  AppShell,
  Badge,
  Burger,
  Group,
  Input,
  NavLink,
  ScrollArea,
  Select,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHeartFilled } from "@tabler/icons-react";
import { matchSorter } from "match-sorter";
import { ReactNode, useMemo, useState } from "react";
import { Place, places } from "../data";
import { useStore } from "../store";
import { LanguageCode, messages } from "../messages";

const languages = Object.keys(messages).map((language) => ({
  value: language,
  label: messages[language as LanguageCode].language,
}));

interface LayoutProps {
  children: ReactNode;
  onSelect: (place: Place) => void;
}

export const Layout = ({ children, onSelect }: LayoutProps) => {
  const theme = useMantineTheme();
  const t = useStore((state) => state.messages);
  const setLanguage = useStore((state) => state.setLanguage);
  const language = useStore((state) => state.language);
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
            {t.title}
          </Text>

          <Text size="md" fw={900} hiddenFrom="sm">
            {t.title}
          </Text>

          <Select
            ml="auto"
            placeholder="Pick value"
            value={language}
            data={languages}
            onChange={(language) => setLanguage(language as LanguageCode)}
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Stack p="md">
          <Input placeholder={`${t.filter}...`} value={search} onChange={(e) => setSearch(e.currentTarget.value)} />
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
