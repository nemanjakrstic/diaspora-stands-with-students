import {
  ActionIcon,
  AppShell,
  Badge,
  Box,
  Burger,
  Divider,
  Group,
  Indicator,
  Input,
  NavLink,
  ScrollArea,
  Stack,
  Tabs,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandInstagram,
  IconCalendar,
  IconGraph,
  IconHeartFilled,
  IconInfoCircle,
  IconMapPin,
} from "@tabler/icons-react";
import { matchSorter } from "match-sorter";
import { ReactNode, useMemo, useState } from "react";
import { eventCountByDate, events, Location, LocationEvent, locations } from "../data";
import { useStore } from "../store";
import { useLocale } from "../stores/locale";
import { orderBy } from "lodash";
import dayjs from "dayjs";
import { StatsModal } from "./StatsModal";

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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [openStatsModal, statsModal] = useDisclosure(false);

  const sortedEvents = useMemo(() => {
    return orderBy(visibleEvents, ["event.dateIso", "location.title"], ["desc", "asc"]).filter((event) => {
      return selectedDate ? dayjs(event.event.dateIso).isSame(selectedDate, "date") : true;
    });
  }, [visibleEvents, selectedDate]);

  const isSelectedDate = (date: Date) => {
    return selectedDate ? dayjs(date).isSame(selectedDate, "date") : false;
  };

  const handleDateClick = (date: Date) => () => {
    const dateIso = dayjs(date).format("YYYY-MM-DD");

    if (dateIso in eventCountByDate) {
      setSelectedDate(isSelectedDate(date) ? undefined : date);
    }
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}>
      <StatsModal opened={openStatsModal} onClose={statsModal.close} />

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

          <Box ml="auto" />

          <Tooltip label={t.show_stats} withArrow>
            <Indicator inline label={t.new} color="green" position="top-start" size={16}>
              <ActionIcon variant="light" onClick={statsModal.open}>
                <IconGraph style={{ width: "80%", height: "80%" }} stroke={1.5} />
              </ActionIcon>
            </Indicator>
          </Tooltip>

          <Tooltip label={t.follow_our_instagram} withArrow>
            <ActionIcon
              component="a"
              href="http://instagram.com/dijasporauzstudente/?utm_source=website&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
              visibleFrom="sm"
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

          {activeTab === "events" ? (
            <>
              <Group justify="center" py="md">
                <Calendar
                  getDayProps={(date) => ({
                    selected: isSelectedDate(date),
                    onClick: handleDateClick(date),
                  })}
                  renderDay={(date) => {
                    const day = date.getDate();
                    const dateIso = dayjs(date).format("YYYY-MM-DD");

                    return (
                      <Indicator
                        color="blue"
                        label={<small>{eventCountByDate[dateIso]}</small>}
                        size={14}
                        offset={-1}
                        disabled={!(dateIso in eventCountByDate)}
                      >
                        <div>{day}</div>
                      </Indicator>
                    );
                  }}
                />
              </Group>

              <Divider />
            </>
          ) : null}

          <ScrollArea>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tabs.Panel value="locations" mah="100%">
                {visibleLocations.map((place, index) => (
                  <NavLink
                    key={index}
                    href="#"
                    label={place.city || place.country}
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
