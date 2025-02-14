import {
  ActionIcon,
  AppShell,
  Badge,
  Burger,
  Group,
  Input,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandInstagram, IconHeartFilled, IconInfoCircle } from "@tabler/icons-react";
import { matchSorter } from "match-sorter";
import { ReactNode, useMemo, useState } from "react";
import { Location, places } from "../data";
import { useStore } from "../store";
import { useLocale } from "../stores/locale";

interface LayoutProps {
  children: ReactNode;
  onSelect: (place: Location) => void;
}

export const Layout = ({ children, onSelect }: LayoutProps) => {
  const theme = useMantineTheme();
  const t = useLocale((state) => state.messages);
  const setLanguage = useLocale((state) => state.setLanguage);
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

          <Text size="sm" fw={900} hiddenFrom="sm">
            {t.title}
          </Text>

          <Tooltip label={t.follow_our_instagram} withArrow>
            <ActionIcon
              ml="auto"
              component="a"
              href="http://instagram.com/dijasporauzstudente/?utm_source=website&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
            >
              <IconBrandInstagram style={{ width: "80%", height: "80%" }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label={t.project_information} withArrow>
            <ActionIcon variant="light" onClick={() => useStore.setState({ showInfoModal: true })}>
              <IconInfoCircle style={{ width: "80%", height: "80%" }} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Stack p="md">
          <Group>
            <Input
              flex={1}
              placeholder={`${t.filter}...`}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />

            <Text
              style={{ cursor: "pointer", color: theme.colors.gray[5] }}
              ml="auto"
              size="sm"
              fw={900}
              onClick={() => setLanguage(language === "en" ? "sr" : "en")}
            >
              {language.toUpperCase()}
            </Text>
          </Group>
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
