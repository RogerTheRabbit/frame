import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState(
    new Date().toLocaleString("en-us", {
      timeStyle: "short",
      hourCycle: "h23",
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
    }, 1000);

    return () => {
      interval;
    };
  }, []);

  return (
    <h1 className="scroll-m-20 m-5 text-center text-8xl font-bold tracking-tight text-balance">
      {time}
    </h1>
  );
}
