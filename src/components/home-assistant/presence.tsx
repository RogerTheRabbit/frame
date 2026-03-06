import { useContext } from "react";
import { HomeAssistantContext } from "./home-assistant-context";

export default function Presence() {
  const hassContext = useContext(HomeAssistantContext);

  return hassContext?.present ? (
    <div
      className={`absolute bottom-0 left-0 m-3 w-5 h-5 rounded-full ${hassContext.sleeping ? "bg-purple-500" : "bg-green-500"}`}
    />
  ) : (
    <div
      className={`absolute top-0 w-full h-full -z-100 ${hassContext?.sleeping ? "bg-purple-500" : "bg-red-500"}`}
    />
  );
}
