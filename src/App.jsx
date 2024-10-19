import "./App.css";
import { SignalRProvider } from "./context/SignalRContext";
import { Router } from "./routes/Router";
// import { NotificationProvider } from './context/NotificationContext';
function App() {
  return (
    <div>
      {/* <NotificationProvider>
        <Router />
      </NotificationProvider> */}
      <SignalRProvider>
        <Router />
      </SignalRProvider>
    </div>
  );
}

export default App;
