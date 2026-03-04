import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  createConnection,
  Connection,
  Auth,
} from "home-assistant-js-websocket";
import { usePersistentState } from "@/lib/usePersistentState";

type Props = {
  children: React.ReactNode;
};

// Define types for Home Assistant config
type HassConfig = {
  light_entities: string[];
  temperature_sensor: string;
  humidity_sensor: string;
};

type HassContext = {
  ws: Connection | null;
  entities: Record<string, string> | null;
  config: HassConfig | null;
  humidity: StatisticChartValue[];
  temperature: StatisticChartValue[];
};

type StatisticChartValue = {
  mean: number;
  start: number;
};

export const HomeAssistantContext = createContext<HassContext | null>(null);

export const HomeAssistantConfigContext = createContext<HassConfig | null>(
  null,
);

export default function HomeAssistantContextProvider(props: Props) {
  const [authTest, setAuth] = usePersistentState<Auth | null>("auth", null);
  const [ws, setWs] = useState<Connection | null>(null);
  const [entities, setEntities] = useState<Record<string, string> | null>(null);
  const [config, setConfig] = useState<HassConfig | null>(null);
  const [humidity, setHumidity] = useState<StatisticChartValue[]>([]);
  const [temperature, setTemperature] = useState<StatisticChartValue[]>([]);

  useEffect(() => {
    getAuth({
      hassUrl: import.meta.env.VITE_HASS_URL,
      saveTokens: setAuth,
      loadTokens: () => authTest,
    })
      .then((auth) => {
        // This is prob a dumb way to remove the `auth_callback` from the url, but installing react-router seems overkill for this.
        // Can revisit if we have other reasons to use react-router
        if (window.location.href.split("?").length > 1) {
          window.location.href = window.location.href.split("?")[0];
        }
        createConnection({ auth }).then((con) => {
          setWs(con);
        });
      })
      .catch((err) => {
        console.error("Failed to authenticate:", err);
      });
  }, []);

  useEffect(() => {
    if (!ws) {
      return;
    }
    fetch("http://localhost:8080/api/hass-config")
      .then((resp) => resp.json())
      .then((respConfig) => {
        setConfig(respConfig);
      })
      .catch((err) => {
        console.log("Failed/parse to fetch hass config:", err);
      });
  }, [ws]);

  useEffect(() => {
    if (!config || !ws) {
      return;
    }

    const refreshStats = () => {
      ws.sendMessagePromise({
        id: 11,
        type: "recorder/statistics_during_period",
        start_time: new Date(
          new Date().getTime() - 60 * 60 * 24000,
        ).toISOString(),
        end_time: new Date().toISOString(),
        statistic_ids: [config?.humidity_sensor, config?.temperature_sensor],
        period: "hour",
      })
        .then((val: any) => {
          setHumidity(
            val[config?.humidity_sensor].map((val2: StatisticChartValue) => {
              return {
                mean: val2.mean,
                start: val2.start,
              };
            }),
          );
          setTemperature(
            val[config?.temperature_sensor].map((val2: StatisticChartValue) => {
              return {
                mean: val2.mean,
                start: val2.start,
              };
            }),
          );
        })
        .catch((err) => {
          console.error("Failed to fetch history", err);
        });
    };

    refreshStats();
    let refreshStatsInterval = setInterval(() => {
      refreshStats();
    }, 900000);

    let unsubscribe = ws.subscribeMessage(
      (msg: any) => {
        // Presumably 'a' for 'all'
        if (msg["a"]) {
          let updatedEntities: Record<string, string> = {};
          Object.entries(msg["a"]).forEach(([key, val]: any) => {
            updatedEntities[key] = val["s"];
          });
          setEntities(updatedEntities);
        }
        // Presumably 'c' for 'change'
        else if (msg["c"]) {
          let updatedEntities: Record<string, string> = {};
          Object.entries(msg["c"]).forEach(([key, val]: any) => {
            updatedEntities[key] = val["+"]["s"];
          });
          setEntities((previousState) => ({
            ...previousState,
            ...updatedEntities,
          }));
        }
      },
      {
        id: 3,
        type: "subscribe_entities",
        entity_ids: [
          ...config.light_entities,
          config.humidity_sensor,
          config.temperature_sensor,
        ],
      },
    );

    return () => {
      unsubscribe.then((unsubscribeFunc) => unsubscribeFunc());
      clearInterval(refreshStatsInterval);
    };
  }, [config]);

  return (
    <HomeAssistantConfigContext value={config}>
      <HomeAssistantContext
        value={{ ws, entities, config, humidity, temperature }}
      >
        {props.children}
      </HomeAssistantContext>
    </HomeAssistantConfigContext>
  );
}
