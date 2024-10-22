import "./App.css";
import { UserProvider } from "./context/UserContext";
import { Router } from "./routes/Router";
// import { NotificationProvider } from './context/NotificationContext';
function App() {
  return (
    <div>
      {/* <NotificationProvider>
        <Router />
      </NotificationProvider> */}
      <Router />
    </div>
  );
}

export default App;
