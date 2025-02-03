import { Button, Chip, Group, Modal, Stack, Tooltip, useMantineTheme } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconHeartFilled } from "@tabler/icons-react";
import Map, { AttributionControl, Layer, MapRef, Marker, Source } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";
import { getUserPosition } from "../bootstrap";
import { Event, Place, places } from "../data";
import { createArc, LngLatLite } from "../utils/geojson";
import { mapStyle } from "../utils/map";
import { Layout } from "./Layout";
import { socket } from "../socket";

const MIN_ZOOM = 1;
const STUDENTS: LngLatLite = { lng: 19.82974214457107, lat: 45.26535625358795 };

let positionIndex = 0;

export const App = () => {
  const theme = useMantineTheme();
  const [count, setCount] = useState(0);
  const [viewState, setViewState] = useState({ longitude: STUDENTS.lng, latitude: STUDENTS.lat, zoom: 4 });
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [debouncedUrl] = useDebouncedValue(selectedEvent?.url, 100);
  const mapRef = useRef<MapRef>(null);
  const [loveMarkerPositions, setLoveMarkerPositions] = useState<number[][]>();
  const [currentLoveMarkerPosition, setCurrentLoveMarkerPosition] = useState<number[]>();
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    socket.on("count", (data: number) => {
      setCount(data);
    });

    socket.on("love", (data: { lng: number; lat: number; count: number }) => {
      positionIndex = 0;
      setCount(data.count);
      setLoveMarkerPositions(createArc(data, STUDENTS).geometry.coordinates);
    });

    return () => {
      socket.off("count");
      socket.off("love");
    };
  }, []);

  useEffect(() => {
    const update = () => {
      if (!loveMarkerPositions || positionIndex >= loveMarkerPositions.length) {
        return;
      }

      positionIndex += 15;
      setCurrentLoveMarkerPosition(loveMarkerPositions[positionIndex]);
      animationFrameId.current = requestAnimationFrame(update);
    };

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [loveMarkerPositions]);

  const sendLove = () => {
    socket.emit("love");
  };

  const selectPlace = (place: Place) => {
    setSelectedPlace(place);
    setSelectedEvent(place.events[0]);
    open();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title={selectedPlace?.title} size="xl">
        <Stack>
          <Group>
            {selectedPlace?.events?.map((event, index) => (
              <Chip key={index} checked={event === selectedEvent} onClick={() => setSelectedEvent(event)}>
                {event.date}
              </Chip>
            ))}
          </Group>

          {selectedEvent && selectedEvent.url === debouncedUrl ? <InstagramEmbed url={selectedEvent.url} /> : null}
        </Stack>
      </Modal>

      <HeartIcon count={count} onClick={sendLove} />

      <Layout onSelect={selectPlace}>
        <Map
          mapStyle={mapStyle}
          ref={mapRef}
          style={{ height: "calc(100vh - 60px)" }}
          attributionControl={false}
          {...viewState}
          onMove={({ viewState }) => setViewState({ ...viewState, zoom: Math.max(MIN_ZOOM, viewState.zoom) })}
        >
          <AttributionControl position="top-right" />

          {places.map((place, index) => (
            <Marker
              key={index}
              longitude={place.location.lng}
              latitude={place.location.lat}
              onClick={() => selectPlace(place)}
            >
              <IconHeartFilled cursor="pointer" color={theme.colors.red[7]} size={24} />
            </Marker>
          ))}

          {places.map((place, index) => (
            <Source key={index} id={`arc-source-${index}`} type="geojson" data={createArc(place.location, STUDENTS)}>
              <Layer
                id={`arc-layer-${index}`}
                type="line"
                source={`arc-source-${index}`}
                layout={{ "line-join": "round", "line-cap": "round" }}
                paint={{ "line-color": "#000", "line-opacity": 0.15, "line-width": 2 }}
              />
            </Source>
          ))}

          <Marker longitude={STUDENTS.lng} latitude={STUDENTS.lat}>
            <IconHeartFilled cursor="pointer" color={theme.colors.red[7]} size={48} />
          </Marker>

          {currentLoveMarkerPosition ? (
            <Marker longitude={currentLoveMarkerPosition[0]} latitude={currentLoveMarkerPosition[1]}>
              <IconHeartFilled cursor="pointer" color={theme.colors.red[7]} size={32} />
            </Marker>
          ) : null}
        </Map>
      </Layout>
    </>
  );
};

const HeartIcon = ({ count, onClick }: { count: number; onClick: () => void }) => {
  return (
    <Tooltip label="Klikni da pošalješ studentima srce" position="bottom" withArrow>
      {/* <ActionIcon
        onClick={onClick}
        style={{ zIndex: 1000 }}
        pos="fixed"
        bottom={10}
        right={10}
        variant="gradient"
        size="xl"
        aria-label="Pošalji podršku studentima"
        gradient={{ from: "red.7", to: "red.9", deg: 90 }}
      >
        <Group>
          <Text>{count}</Text> <IconHeartFilled />
        </Group>
      </ActionIcon> */}

      <Button.Group style={{ zIndex: 1000 }} pos="fixed" bottom={10} right={10}>
        <Button.GroupSection variant="default" bg="var(--mantine-color-body)" miw={60}>
          {count}
        </Button.GroupSection>

        <Button variant="default" radius="md" onClick={onClick}>
          <IconHeartFilled color="red" />
        </Button>
      </Button.Group>
    </Tooltip>
  );
};
