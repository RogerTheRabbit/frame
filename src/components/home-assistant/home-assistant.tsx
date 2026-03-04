import { useEffect, useState } from "react";

import { LightbulbIcon, LightbulbOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  getAuth,
  createConnection,
  Connection,
  Auth,
} from "home-assistant-js-websocket";
import { usePersistentState } from "@/lib/usePersistentState";
import { ChartContainer, type ChartConfig } from "../ui/chart";
import { Area, AreaChart } from "recharts";

// Define types for Home Assistant config
type HassConfig = {
  light_entities: string[];
  temperature_sensor: string;
  humidity_sensor: string;
};

type StatisticChartValue = {
  mean: number;
  start: number;
};

const chartConfig = {} satisfies ChartConfig;

export default function HomeAssistant() {
  const [authTest, setAuth] = usePersistentState<Auth | null>("auth", null);
  const [ws, setWs] = useState<Connection | null>(null);
  const [entities, setEntities] = useState<Record<string, string> | null>(null);
  const [config, setConfig] = useState<HassConfig | null>(null);
  const [humidity, setHumidity] = useState<StatisticChartValue[]>();
  const [temperature, setTemperature] = useState<StatisticChartValue[]>();

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

  const temperatureMin =
    temperature?.reduce(
      (cum, cur) => Math.min(cum, cur.mean),
      Number.MAX_SAFE_INTEGER,
    ) || 0;

  const humidityMin =
    humidity?.reduce(
      (cum, cur) => Math.min(cum, cur.mean),
      Number.MAX_SAFE_INTEGER,
    ) || 0;

  return (
    <>
      <div className="absolute top-0 right-0 p-3">
        {entities &&
          config?.light_entities.map((lightEntityId, idx) => {
            return (
              <Button
                key={idx}
                variant="secondary"
                className="ml-2 w-20 h-20"
                onClick={() => {
                  ws?.sendMessage({
                    id: 20,
                    type: "call_service",
                    domain: lightEntityId.split(".")[0],
                    service: "toggle",
                    target: {
                      entity_id: lightEntityId,
                    },
                  });
                }}
                disabled={!ws}
              >
                {entities[lightEntityId] === "on" ? (
                  <LightbulbIcon />
                ) : (
                  <LightbulbOffIcon />
                )}
              </Button>
            );
          })}
      </div>
      <div className="absolute top-0 left-0 p-3 flex">
        <ChartContainer config={chartConfig} className="w-66 h-20">
          <AreaChart
            data={humidity?.map((val) => ({
              ...val,
              mean: val.mean - humidityMin + 2,
            }))}
          >
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              dataKey="mean"
              yAxisId="humidity"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="#2563eb"
              strokeWidth={3}
              stackId="a"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 40, fontWeight: 600, fill: "currentColor" }}
            >
              {entities &&
                Math.round(parseFloat(entities[config?.humidity_sensor || ""]))}
              %
            </text>
          </AreaChart>
        </ChartContainer>
        <ChartContainer config={chartConfig} className="w-66 h-20">
          <AreaChart
            data={temperature?.map((val) => ({
              ...val,
              mean: val.mean - temperatureMin + 2,
            }))}
          >
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="mean"
              yAxisId="temperature"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="#2563eb"
              strokeWidth={3}
              stackId="a"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: 40,
                fontWeight: 600,
                fill: "currentColor",
              }}
            >
              {entities &&
                Math.round(
                  parseFloat(entities[config?.temperature_sensor || ""]),
                )}
              °
            </text>
          </AreaChart>
        </ChartContainer>
      </div>
    </>
  );
}
