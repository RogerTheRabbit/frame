import { Clock } from "./components/clock";
import { Container } from "./components/container";
import { ThemeProvider } from "./components/theme-provider";
import { WhoseHome } from "./components/whosehome";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Container>
        <Clock />
        <WhoseHome />
      </Container>
    </ThemeProvider>
  );
}

export default App;
