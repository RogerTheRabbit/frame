import { Clock } from "./components/clock";
import { Container } from "./components/container";
import HomeAssistant from "./components/home-assistant/home-assistant";
import HomeAssistantContextProvider from "./components/home-assistant/home-assistant-context";
import Weather from "./components/weather/weather";
import { WhoseHome } from "./components/whosehome";
import BatteryAlert from "./components/home-assistant/battery-alert";
import Presence from "./components/home-assistant/presence";
import AdminButton from "./components/admin/admin-button";

export function App() {
  return (
    <>
      <Container>
        <div className="m-10">
          <Clock />
          <WhoseHome />
        </div>
        <div className="m-10">
          <Weather />
        </div>
      </Container>
      <HomeAssistantContextProvider>
        <HomeAssistant />
        <BatteryAlert />
        <Presence />
      </HomeAssistantContextProvider>
      <AdminButton />
    </>
  );
}

export default App;
