import { BrandClient } from "@/Client/Brand.client";
import type { BrandResponseDto } from "@/Dto/Brand.dto";
import { useEffect, useState } from "react";

type Props = {
  selectedBrandId: number;
  onSelect: (id: number, name: string) => void;
};

export default function Sidebar({ selectedBrandId, onSelect }: Props) {
  const [brands, setBrands] = useState<BrandResponseDto[]>([]);

  useEffect(() => {
    BrandClient.getBrands(undefined, undefined, 1, 100)
      .then((data) => setBrands(data ?? []))
      .catch(() => setBrands([]));
  }, []);

  return (
    <div className="h-screen w-52 bg-gray-300 sticky border-2 border-black top-0 overflow-y-auto rounded-tr-2xl rounded-br-2xl mr-5">
      <div className="space-y-1 p-2">
        <button
          onClick={() => onSelect(0, "")}
          className={`w-full text-left px-3 py-2 rounded ${
            selectedBrandId === 0
              ? "bg-gray-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          All Brands
        </button>

        {brands.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelect(b.id, b.name)}
            className={`w-full text-left px-3 py-2 rounded ${
              selectedBrandId === b.id
                ? "bg-gray-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {b.name}
          </button>
        ))}

        {brands.length === 0 && (
          <div className="px-3 py-2 text-sm text-gray-600">No brands</div>
        )}
      </div>
    </div>
  );
}
