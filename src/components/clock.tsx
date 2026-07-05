import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState(
    new Date().toLocaleString("en-us", {
      timeStyle: "short",
      hourCycle: "h23",
    }),
  );

  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString("en-us", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
  );

  useEffect(() => {
    let interval = setInterval(() => {
      setTime(
        new Date().toLocaleString("en-us", {
          timeStyle: "short",
          hourCycle: "h23",
        }),
      );
      setDate(
        new Date().toLocaleDateString("en-us", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="text-center">
      <h1 className="m-1 text-8xl font-bold tracking-tight text-balance">
        {time}
      </h1>
      <h3 className="text-5xl text-neutral-400 font-bold tracking-tight text-balance">
        {date}
      </h3>
    </div>
  );
}
