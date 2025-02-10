import { Button, Chip, Group, Modal, Stack, Tooltip, useMantineTheme } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconHeartFilled } from "@tabler/icons-react";
import Map, { AttributionControl, Layer, MapRef, Marker, Source } from "@vis.gl/react-maplibre";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";
import { Event, Place, places } from "../data";
import { useAnimatedMarkers } from "../hooks/useAnimatedMarkers";
import { socket } from "../socket";
import { useStore } from "../store";
import { createArc, LngLatLite } from "../utils/geojson";
import { mapStyle } from "../utils/map";
import { Layout } from "./Layout";
import { InfoModal } from "./InfoModal";

const MIN_ZOOM = 1;
const MAX_ZOOM = 7;

const STUDENTS: LngLatLite = { lng: 20.2576633, lat: 44.8152408 };

interface BasePayload {
  id: string;
  location: LngLatLite;
  count: number;
}

interface InitPayload extends BasePayload {
  ip: string;
}

export const App = () => {
  const theme = useMantineTheme();
  const [scrolledToBounds, setScrolledToBounds] = useState(false);
  const [count, setCount] = useState(0);
  const [id, setId] = useState<string>();
  const [viewState, setViewState] = useState({ longitude: STUDENTS.lng, latitude: STUDENTS.lat, zoom: 4 });
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedPlace, setSelectedPlace] = useState<Place>();
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [debouncedUrl] = useDebouncedValue(selectedEvent?.url, 100);
  const mapRef = useRef<MapRef>(null);
  const addAnimatedMarker = useAnimatedMarkers();

  useEffect(() => {
    socket.on("init", (data: InitPayload) => {
      console.log("init", data);
      setId(data.id);
      setCount(data.count);
    });

    socket.on("support", (data: BasePayload) => {
      console.log("support", data);
      setCount(data.count);
      const map = mapRef.current?.getMap();

      if (map) {
        addAnimatedMarker(map, data.location, STUDENTS);

        if (data.id === id && !scrolledToBounds) {
          const bounds = new LngLatBounds();
          bounds.extend([data.location.lng, data.location.lat]);
          bounds.extend([STUDENTS.lng, STUDENTS.lat]);
          map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
          setScrolledToBounds(true);
        }
      }
    });

    return () => {
      socket.off("init");
      socket.off("support");
    };
  }, [addAnimatedMarker, id, scrolledToBounds]);

  const handleSupportButtonClick = () => {
    socket.emit("support");
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

      <InfoModal />

      <HeartIcon count={count} onClick={handleSupportButtonClick} />

      <Layout onSelect={selectPlace}>
        <Map
          mapStyle={mapStyle}
          ref={mapRef}
          style={{ height: "calc(100vh - 60px)" }}
          attributionControl={false}
          {...viewState}
          onMove={({ viewState }) =>
            setViewState({ ...viewState, zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, viewState.zoom)) })
          }
          onClick={(e) => {
            if (import.meta.env.DEV) {
              console.log(`${e.lngLat.lat},${e.lngLat.lng}`);
            }
          }}
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
        </Map>
      </Layout>
    </>
  );
};

const HeartIcon = ({ count, onClick }: { count: number; onClick: () => void }) => {
  const t = useStore((state) => state.messages);

  return (
    <Tooltip label={t.click_to_show_support} position="bottom" withArrow>
      <Button.Group style={{ zIndex: 90 }} pos="fixed" bottom={10} right={10}>
        <Button.GroupSection size="lg" variant="default" bg="var(--mantine-color-body)" miw={60}>
          {count}
        </Button.GroupSection>

        <Button size="lg" variant="default" radius="md" onClick={onClick}>
          <IconHeartFilled color="red" />
        </Button>
      </Button.Group>
    </Tooltip>
  );
};
