import { useContext } from "react";

import { LightbulbIcon, LightbulbOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ChartContainer, type ChartConfig } from "../ui/chart";
import { Area, AreaChart } from "recharts";
import { HomeAssistantContext } from "./home-assistant-context";

const chartConfig = {} satisfies ChartConfig;

export default function HomeAssistant() {
  const hassContext = useContext(HomeAssistantContext);

  const temperatureMin =
    hassContext?.temperature?.reduce(
      (cum, cur) => Math.min(cum, cur.mean),
      Number.MAX_SAFE_INTEGER,
    ) || 0;

  const humidityMin =
    hassContext?.humidity?.reduce(
      (cum, cur) => Math.min(cum, cur.mean),
      Number.MAX_SAFE_INTEGER,
    ) || 0;

  const co2Min =
    hassContext?.co2?.reduce(
      (cum, cur) => Math.min(cum, cur.mean),
      Number.MAX_SAFE_INTEGER,
    ) || 0;

  return (
    <>
      <div className="absolute top-0 right-0 p-3">
        {hassContext?.entities &&
          hassContext?.config?.light_entities.map((lightEntityId, idx) => {
            return (
              <Button
                key={idx}
                variant="secondary"
                className="ml-2 w-20 h-20"
                onClick={() => {
                  hassContext?.ws?.sendMessage({
                    id: 20,
                    type: "call_service",
                    domain: lightEntityId.split(".")[0],
                    service: "toggle",
                    target: {
                      entity_id: lightEntityId,
                    },
                  });
                }}
                disabled={!hassContext?.ws}
              >
                {hassContext?.entities &&
                hassContext.entities[lightEntityId] === "on" ? (
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
            data={hassContext?.humidity?.map((val) => ({
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
              {hassContext?.entities &&
                Math.round(
                  parseFloat(
                    hassContext?.entities[
                      hassContext?.config?.humidity_sensor || ""
                    ],
                  ),
                )}
              %
            </text>
          </AreaChart>
        </ChartContainer>
        <ChartContainer config={chartConfig} className="w-66 h-20">
          <AreaChart
            data={hassContext?.temperature?.map((val) => ({
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
              {hassContext?.entities &&
                Math.round(
                  parseFloat(
                    hassContext?.entities[
                      hassContext?.config?.temperature_sensor || ""
                    ],
                  ),
                )}
              °
            </text>
          </AreaChart>
        </ChartContainer>
        <ChartContainer config={chartConfig} className="w-66 h-20">
          <AreaChart
            data={hassContext?.co2?.map((val) => ({
              ...val,
              mean: val.mean - co2Min + 2,
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
              yAxisId="co2"
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
              {hassContext?.entities &&
                Math.round(
                  parseFloat(
                    hassContext?.entities[
                      hassContext?.config?.co2_sensor || ""
                    ],
                  ),
                )}{" "}
              ppm
            </text>
          </AreaChart>
        </ChartContainer>
      </div>
    </>
  );
}
