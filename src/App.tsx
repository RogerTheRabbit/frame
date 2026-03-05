import { Clock } from "./components/clock";
import { Container } from "./components/container";
import HomeAssistant from "./components/home-assistant/home-assistant";
import HomeAssistantContextProvider from "./components/home-assistant/home-assistant-context";
import { ThemeProvider } from "./components/theme-provider";
import Weather from "./components/weather/weather";
import { WhoseHome } from "./components/whosehome";
import BatteryAlert from "./components/home-assistant/battery-alert";
import Presence from "./components/home-assistant/presence";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
    </ThemeProvider>
  );
}

export default App;
