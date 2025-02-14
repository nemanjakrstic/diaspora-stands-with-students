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
  Tabs,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandInstagram, IconCalendar, IconHeartFilled, IconInfoCircle, IconMapPin } from "@tabler/icons-react";
import { matchSorter } from "match-sorter";
import { ReactNode, useMemo, useState } from "react";
import { events, Location, LocationEvent, locations } from "../data";
import { useStore } from "../store";
import { useLocale } from "../stores/locale";
import { orderBy } from "lodash";

interface LayoutProps {
  children: ReactNode;
  onSelect: (place: Location, event: LocationEvent) => void;
}

export const Layout = ({ children, onSelect }: LayoutProps) => {
  const theme = useMantineTheme();
  const t = useLocale((state) => state.messages);
  const setLanguage = useLocale((state) => state.setLanguage);
  const language = useStore((state) => state.language);
  const [opened, { toggle, close }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const visibleLocations = useMemo(() => matchSorter(locations, search, { keys: ["title"] }), [search]);
  const visibleEvents = useMemo(() => matchSorter(events, search, { keys: ["location.title"] }), [search]);
  const [activeTab, setActiveTab] = useState<string | null>("locations");

  const sortedEvents = useMemo(
    () => orderBy(visibleEvents, ["event.dateIso", "location.title"], ["desc", "asc"]),
    [visibleEvents],
  );

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <IconHeartFilled color={theme.colors.red[7]} size={30} />

          <Text size="xl" fw={900} visibleFrom="sm">
            {t.title}
          </Text>

          <Text size="sm" fw={900} hiddenFrom="sm" maw={190}>
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

          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List grow>
              <Tabs.Tab value="locations" leftSection={<IconMapPin size={12} />}>
                {t.locations}
              </Tabs.Tab>

              <Tabs.Tab value="events" leftSection={<IconCalendar size={12} />}>
                {t.events}
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <ScrollArea>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.Panel value="locations" mah="100%">
                {visibleLocations.map((place, index) => (
                  <NavLink
                    key={index}
                    href="#"
                    label={place.city}
                    description={place.country}
                    onClick={() => {
                      onSelect(place, place.events[0]);
                      close();
                    }}
                    leftSection={
                      <Badge size="xs" color="blue" circle>
                        {place.events.length}
                      </Badge>
                    }
                  />
                ))}
              </Tabs.Panel>

              <Tabs.Panel value="events">
                <ScrollArea>
                  {sortedEvents.map((event, index) => (
                    <NavLink
                      key={index}
                      href="#"
                      label={event.location.title}
                      description={event.event.date}
                      onClick={() => {
                        onSelect(event.location, event.event);
                        close();
                      }}
                    />
                  ))}
                </ScrollArea>
              </Tabs.Panel>
            </Tabs>
          </ScrollArea>
        </AppShell.Navbar>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
