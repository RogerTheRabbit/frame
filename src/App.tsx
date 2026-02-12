import { Clock } from "./components/clock";
import { Container } from "./components/container";
import { ThemeProvider } from "./components/theme-provider";
import Weather from "./components/weather/weather";
import { WhoseHome } from "./components/whosehome";

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
    </ThemeProvider>
  );
}

export default App;
