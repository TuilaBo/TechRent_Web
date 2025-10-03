import { Routes, Route } from "react-router-dom";
import LayoutRoot from "./layout/LayoutRoot.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import RegisterForm from "./pages/auth/RegisterForm.jsx";
import DeviceDetail from "./pages/DeviceDetail.jsx";
export default function App() {
return (
<Routes>
<Route element={<LayoutRoot />}>
<Route path="/" element={<Home />} />
<Route path="*" element={<NotFound />} />
<Route path="/login" element={<LoginForm />} />
<Route path="/register" element={<RegisterForm />} />
<Route path="/devices/:Id" element={<DeviceDetail />} />
</Route>
</Routes>
);
}