import { WeatherIconMap } from "./weathermapping";

export type Forecast = {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: {
      code: keyof typeof WeatherIconMap;
    };
  };
};

type Props = {
  forecast: Forecast;
  forecastMaxTemp: number;
  forecastMinTemp: number;
};

const weekday = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeatherDay(props: Props) {
  const maxTemp = props.forecast?.day?.maxtemp_c;
  const minTemp = props.forecast?.day?.mintemp_c;
  const delta = props.forecastMaxTemp - props.forecastMinTemp;
  const topPercentage = Math.round(
    ((props.forecastMaxTemp - maxTemp) / delta) * 100,
  );
  const botPercentage = Math.round(
    ((minTemp - props.forecastMinTemp) / delta) * 100,
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="text-md text-muted-foreground leading-none font-medium text-center">
        {weekday[new Date(props.forecast?.date).getUTCDay()]}
      </h3>
      <img
        className="w-10 my-4 mx-2"
        src={WeatherIconMap[props.forecast.day.condition.code]}
      />
      <h3 className="text-lg leading-none font-medium text-center">
        {Math.round(maxTemp)}°
      </h3>
      <div className="h-30 w-full relative m-3">
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-6 rounded-full bg-gradient-to-b from-neutral-300 to-neutral-500`}
          style={{ top: `${topPercentage}%`, bottom: `${botPercentage}%` }}
        />
      </div>
      <h3 className="text-lg leading-none font-medium text-center">
        {Math.round(minTemp)}°
      </h3>
    </div>
  );
}
