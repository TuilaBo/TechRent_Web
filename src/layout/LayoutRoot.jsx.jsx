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
    let raf = null;

    const isStacked = (el) => {
      if (!el) return false;
      const root = el.firstElementChild || el; // phần tử thực tế render
      const pos = getComputedStyle(root).position;
      return pos === "fixed" || pos === "sticky";
    };

    const calc = () => {
      raf = requestAnimationFrame(() => {
        const h1 = headerRef.current?.getBoundingClientRect().height || 0;
        const h2 = categoriesRef.current?.getBoundingClientRect().height || 0;

        const total =
          (isStacked(headerRef.current) ? h1 : 0) +
          (isStacked(categoriesRef.current) ? h2 : 0);

        document.documentElement.style.setProperty(
          "--stacked-header",
          `${total}px`
        );
      });
    };

    calc();
    window.addEventListener("resize", calc);
    return () => {
      window.removeEventListener("resize", calc);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Layout className="min-h-screen bg-gray-50 text-gray-900">
      {/* 2 khối trên */}
      <div ref={headerRef}>
        <Header />
      </div>
      <div ref={categoriesRef}>
        <CategoryGrid />
      </div>

      {/* Fallback = 0 để không hở khi chưa set biến */}
      <Content className="pt-[var(--stacked-header,0px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </Content>

      <FooterBar />
    </Layout>
  );
}
