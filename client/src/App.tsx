import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@pages/Home";
import Auth from "@pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth variant="login" />} />
        <Route path="/signup" element={<Auth variant="signup" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
