import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/footer";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";

export default function Home() {
  const [brandId, setBrandId] = useState<number>(0);

  return (
    <div className="h-screen flex flex-col bg-gray-300">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar selectedBrandId={brandId} onSelect={setBrandId} />

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ProductList brandId={brandId} pageSize={6} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
