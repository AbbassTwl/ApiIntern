import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { PhoneResponseDto } from "../Dto/Phone.dto";
import { PhoneClient } from "../Client/Phone.client";
import SearchBar from "./SearchBar";
import { PhoneCard } from "./PhoneCard";
import EditPhoneForm from "../components/EditPhoneForm";
import AddPhoneForm from "../components/AddPhoneForm";
import AddBrandForm from "../components/AddBrandForm";
import { Pagination,  PaginationContent, PaginationPrevious, PaginationNext} from "../components/ui/pagination";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

type Props = {
  brandId: number;
  brandName: string;
  pageSize?: number;
  onBrandsChanged?: () => void; };

export default function ProductList({
  brandId,
  brandName,
  pageSize = 6,
  onBrandsChanged,
}: Props) {
  const [phones, setPhones] = useState<PhoneResponseDto[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 300);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [editing, setEditing] = useState<{
    id: number;
    initial: { name: string; price: number; description: string; imageUrl: string };
  } | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Manage page state via URL
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    params.set("brandId", String(brandId));
    params.set("brand", brandName);
    setSearchParams(params);
  };

  const hasPrevPage = page > 1;

  // Load data
  const loadPage = useCallback(
    async (pageNumber: number) => {
      const fetched = await PhoneClient.getPhones(
        brandId === 0 ? undefined : brandId,
        debounced || undefined,
        pageNumber,
        pageSize
      );

      setPhones(fetched ?? []);

      const nextPageData = await PhoneClient.getPhones(
        brandId === 0 ? undefined : brandId,
        debounced || undefined,
        pageNumber + 1,
        pageSize
      );
      setHasNextPage(Array.isArray(nextPageData) && nextPageData.length > 0);
    },
    [brandId, debounced, pageSize]
  );

  useEffect(() => {
    loadPage(page).catch(() => {
      setPhones([]);
      setHasNextPage(false);
    });
  }, [loadPage, page]);

  // Delete product
  async function handleDelete(id: number) {
    if (!confirm("Delete this phone?")) return;
    try {
      await PhoneClient.deletePhone(id);
      const updated = await PhoneClient.getPhones(
        brandId === 0 ? undefined : brandId,
        debounced || undefined,
        page,
        pageSize
      );
      setPhones(updated ?? []);
    } catch {
      alert("Failed to delete. Please try again.");
    }
  }

  // Pagination actions
  const handleNextPage = () => {
    if (hasNextPage) handlePageChange(page + 1);
  };

  const handlePrevPage = () => {
    if (hasPrevPage) handlePageChange(page - 1);
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddBrand(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Brand
            </Button>
            <Button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {phones.length === 0 ? (
        <div className="grid place-items-center h-40 text-gray-600">
          No products found {brandName && `for ${brandName}`}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {phones.map((p) => (
            <PhoneCard
              key={p.id}
              name={p.name ?? ""}
              brand={p.brandName ?? ""}
              image={p.imageUrl || "null"}
              price={p.price}
              desc={p.description ? [p.description] : undefined}
              isAdmin={isAdmin}
              onEdit={() =>
                setEditing({
                  id: p.id,
                  initial: {
                    name: p.name ?? "",
                    price: p.price,
                    description: p.description ?? "",
                    imageUrl: p.imageUrl ?? "",
                  },
                })
              }
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationPrevious
            onClick={hasPrevPage ? handlePrevPage : undefined}
            className={!hasPrevPage ? "pointer-events-none opacity-50" : ""}
          />
          <span className="px-3 text-sm text-gray-700">Page {page}</span>
          <PaginationNext
            onClick={hasNextPage ? handleNextPage : undefined}
            className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationContent>
      </Pagination>

      {/* Edit Product */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 grid place-items-center p-4 z-50">
          <EditPhoneForm
            phoneId={editing.id}
            initial={editing.initial}
            onSuccess={async () => {
              setEditing(null);
              await loadPage(page);
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* Add Product */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/80 grid place-items-center p-4 z-50">
          <AddPhoneForm
            onSuccess={async () => {
              setShowCreate(false);
              handlePageChange(1);
              await loadPage(1);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

      {/* Add Brand */}
      {showAddBrand && (
        <div className="fixed inset-0 bg-black/80 grid place-items-center p-4 z-50">
          <AddBrandForm
            onSuccess={() => {
              setShowAddBrand(false);
              onBrandsChanged?.();
            }}
            onCancel={() => setShowAddBrand(false)}
          />
        </div>
      )}
    </div>
  );
}
