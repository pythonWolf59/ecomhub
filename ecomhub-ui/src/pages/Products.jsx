import ProductCard from "../components/ProductCard";

const products = [
  { name: "Xbox Gift Card", price: 150, image: "Xbox 100 SAR Card.jpg" },
  { name: "Steam Gift Card", price: 250, image: "Steam 250 SAR Card.png" },
  { name: "Steam Gift Card", price: 500, image: "Steam 500 SAR Card.png" },
  { name: "Amazon Gift Card", price: 100, image: "Amazon 100 SAR Card.png" },
  { name: "Amazon Gift Card", price: 200, image: "Amazon 250 SAR Card.png" },
  { name: "Amazon Gift Card", price: 300, image: "Amazon 300 SAR Card.png" },
];

export default function Products() {
  return (
    <section className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p, i) => (
        <ProductCard key={i} product={p} />
      ))}
    </section>
  );
}
