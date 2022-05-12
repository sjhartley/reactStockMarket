import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import Data from "./routes/data";
import Radio from "./routes/radio";
import Watchlist from "./routes/watchlist1";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="data" element={<Data />} />
      <Route path="radio" element={<Radio />} />
      <Route path="watchlist" element={<Watchlist />} />
    </Routes>
  </BrowserRouter>
);
