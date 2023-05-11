import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "@pages/Homepage";
import Auth from "@pages/Auth";
import Dashboard from "@pages/Dashboard/Dashboard";
import Home from "@/pages/Dashboard/Home";
import Users from "@pages/Dashboard/Users";
import Roles from "@pages/Dashboard/Roles/Roles";

import { store } from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Auth variant="login" />} />
          <Route path="/signup" element={<Auth variant="signup" />} />
          <Route path="/admin" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
