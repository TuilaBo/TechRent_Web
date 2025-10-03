import Hero from "../components/Hero.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />

      <section className="space-y-6">
        <ProductCard />
        {/* TODO: render CategoryGrid nếu bạn muốn */}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
        </div>

        {/* ProductCard tự render grid mock data */}
        <ProductCard />
      </section>
    </div>
  );
}
