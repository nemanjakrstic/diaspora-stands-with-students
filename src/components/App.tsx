import { Button, Chip, Group, Modal, Stack, Tooltip, useMantineTheme } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconHeartFilled } from "@tabler/icons-react";
import Map, { AttributionControl, Layer, MapRef, Marker, Source } from "@vis.gl/react-maplibre";
import { LngLatBounds } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";
import { Location, LocationEvent, locations } from "../data";
import { useAnimatedMarkers } from "../hooks/useAnimatedMarkers";
import { socket } from "../socket";
import { useStore } from "../store";
import { useLocale } from "../stores/locale";
import { createArc, LngLatLite } from "../utils/geojson";
import { mapStyle } from "../utils/map";
import { InfoModal } from "./InfoModal";
import { Layout } from "./Layout";
import { sampleSize } from "lodash";

// Show only half of the arcs to improve performance
const arcLocations = sampleSize(locations, locations.length / 2);

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
  const count = useStore((state) => state.count);
  const [id, setId] = useState<string>();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [selectedEvent, setSelectedEvent] = useState<LocationEvent>();
  const [debouncedUrl] = useDebouncedValue(selectedEvent?.url, 100);
  const mapRef = useRef<MapRef>(null);
  const addAnimatedMarker = useAnimatedMarkers();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    socket.on("init", (data: InitPayload) => {
      // console.log("init", data);
      setId(data.id);
      setReady(true);
      useStore.setState({ count: data.count });
    });

    socket.on("support", (data: BasePayload) => {
      // console.log("support", data);
      useStore.setState({ count: data.count });
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

  const selectEvent = (location: Location, event: LocationEvent) => {
    setSelectedLocation(location);
    setSelectedEvent(event);
    open();
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title={selectedLocation?.title} size="xl">
        <Stack>
          <Group>
            {selectedLocation?.events?.map((event, index) => (
              <Chip key={index} checked={event === selectedEvent} onClick={() => setSelectedEvent(event)}>
                {event.date}
              </Chip>
            ))}
          </Group>

          {selectedEvent && selectedEvent.url === debouncedUrl ? <InstagramEmbed url={selectedEvent.url} /> : null}
        </Stack>
      </Modal>

      <InfoModal />

      <HeartIcon count={count} onClick={handleSupportButtonClick} disabled={!ready} />

      <Layout onSelect={selectEvent}>
        <Map
          mapStyle={mapStyle}
          maxZoom={MAX_ZOOM}
          minZoom={MIN_ZOOM}
          ref={mapRef}
          initialViewState={{ longitude: STUDENTS.lng, latitude: STUDENTS.lat, zoom: 4 }}
          style={{ height: "calc(100vh - 60px)" }}
          attributionControl={false}
          onClick={(e) => {
            if (import.meta.env.DEV) {
              console.log(`${e.lngLat.lat},${e.lngLat.lng}`);
            }
          }}
        >
          <AttributionControl position="top-right" />

          {locations.map((place, index) => (
            <Marker
              key={index}
              longitude={place.location.lng}
              latitude={place.location.lat}
              onClick={() => selectEvent(place, place.events[0])}
            >
              <IconHeartFilled cursor="pointer" color={theme.colors.red[7]} size={24} />
            </Marker>
          ))}

          {arcLocations.map((place, index) => (
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

const HeartIcon = ({ count, onClick, disabled }: { count: number; onClick: () => void; disabled: boolean }) => {
  const t = useLocale((state) => state.messages);

  return (
    <Tooltip label={disabled ? "Network issue" : t.click_to_show_support} position="bottom" withArrow>
      <Button.Group style={{ zIndex: 90 }} pos="fixed" bottom={10} right={10}>
        <Button.GroupSection size="lg" variant="default" bg="var(--mantine-color-body)" miw={60}>
          {count}
        </Button.GroupSection>

        {disabled ? null : (
          <Button size="lg" variant="default" radius="md" onClick={onClick}>
            <IconHeartFilled color="red" />
          </Button>
        )}
      </Button.Group>
    </Tooltip>
  );
};
