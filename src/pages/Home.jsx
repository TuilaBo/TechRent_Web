import Hero from "../components/Hero.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Kéo Hero sát lên header: dịch lên 24–32px */}
      <div className="-translate-y-6 md:-translate-y-8">
        <Hero />
      </div>

      {/* Bù lại khoảng đã kéo để tổng layout không bị hụt */}
      <section className="space-y-6 translate-y-6 md:translate-y-8">
        <ProductCard />
      </section>

      <section className="space-y-6 translate-y-6 md:translate-y-8">
        <ProductCard />
      </section>
    </div>
  );
}
