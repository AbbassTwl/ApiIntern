import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/footer";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const brandId = Number(searchParams.get("brandId")) || 0;
  const brandName = searchParams.get("brand") || "";

  const handleBrandSelect = useCallback(
    (id: number, name: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("brandId", String(id));
      newParams.set("brand", name);
      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return (
    <div className="h-screen flex flex-col bg-gray-300">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar selectedBrandId={brandId} onSelect={handleBrandSelect} />
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ProductList
            brandId={brandId}
            brandName={brandName}
            pageSize={6}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
