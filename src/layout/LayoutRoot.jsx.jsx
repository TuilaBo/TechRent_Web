import { useEffect, useRef } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import FooterBar from "../shared/FooterBar.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import Header from "../shared/Header.jsx";

const { Content } = Layout;

export default function LayoutRoot() {
  const headerRef = useRef(null);
  const categoriesRef = useRef(null);

  useEffect(() => {
    const calc = () => {
      const h1 = headerRef.current?.getBoundingClientRect().height || 0;
      const h2 = categoriesRef.current?.getBoundingClientRect().height || 0;
      const total = h1 + h2; // tổng chiều cao 2 thanh phía trên
      document.documentElement.style.setProperty("--stacked-header", `${total}px`);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return (
    <Layout className="min-h-screen bg-gray-50 text-gray-900">
      {/* Nếu Header/CategoryGrid là fixed/sticky thì cứ để như cũ;
          ta đo chiều cao thật của chúng rồi đẩy Content xuống bằng padding-top */}
      <div ref={headerRef}>
        <Header />
      </div>
      <div ref={categoriesRef}>
        <CategoryGrid />
      </div>

      <Content
        // fallback 128px nếu biến chưa được set (lần render đầu)
        className="pt-[var(--stacked-header,128px)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </Content>

      <FooterBar />
    </Layout>
  );
}
