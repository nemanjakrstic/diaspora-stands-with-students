import { Alert, Modal, ModalProps } from "@mantine/core";
import { useLocale } from "../stores/locale";
import { LineChart } from "@mantine/charts";
import { eventCountByWeek } from "../data";
import { useMemo } from "react";
import { Message } from "../i18n";

export const StatsModal = (props: ModalProps) => {
  const t = useLocale((state) => state.messages);

  const data = useMemo(() => {
    return eventCountByWeek.map(([week, count]) => ({ week, count }));
  }, []);

  return (
    <Modal {...props} size="xl" title={t.stats}>
      <LineChart
        h={300}
        data={data}
        dataKey="week"
        series={[{ name: "count", label: t.event_count_by_week, color: "blue" }]}
        curveType="natural"
        withLegend
        mb="md"
        p="lg"
      />

      <Alert>
        <Message tpl={t.stats_disclaimer}>
          {{
            GitHub: () => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/nemanjakrstic/diaspora-stands-with-students"
              >
                GitHub
              </a>
            ),
          }}
        </Message>
      </Alert>
    </Modal>
  );
};
