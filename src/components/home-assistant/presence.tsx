import { useContext } from "react";
import { HomeAssistantContext } from "./home-assistant-context";

export default function Presence() {
  const hassContext = useContext(HomeAssistantContext);

  return (
    <div
      className={`absolute bottom-0 left-0 m-3 w-5 h-5 rounded-full  ${hassContext?.present ? "bg-green-500" : "bg-red-500"}`}
    />
  );
}
