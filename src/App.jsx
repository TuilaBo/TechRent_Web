import { Routes, Route } from "react-router-dom";
import LayoutRoot from "./layout/LayoutRoot.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import RegisterForm from "./pages/auth/RegisterForm.jsx";
import DeviceDetail from "./pages/DeviceDetail.jsx";
import MyOrders from "./pages/orders/MyOrders.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
import CheckoutPage from "./pages/cart/CheckoutPage.jsx";
import KycPage from "./pages/KYC/KycPage.jsx";
export default function App() {
return (
<Routes>
<Route element={<LayoutRoot />}>
<Route path="/" element={<Home />} />
<Route path="*" element={<NotFound />} />
<Route path="/login" element={<LoginForm />} />
<Route path="/register" element={<RegisterForm />} />
<Route path="/devices/:Id" element={<DeviceDetail />} />
<Route path="/orders" element={<MyOrders/>}/>
<Route path="/cart" element={<CartPage />} />
<Route path="/checkout" element={<CheckoutPage />} />
<Route path="/KYC" element={<KycPage />} />
</Route>
</Routes>
);
}