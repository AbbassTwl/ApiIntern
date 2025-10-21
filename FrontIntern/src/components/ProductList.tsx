import { useEffect, useState, useCallback } from "react";
import type { PhoneResponseDto } from "@/Dto/Phone.dto";
import { PhoneClient } from "@/Client/Phone.client";
import SearchBar from "./SearchBar";
import { PhoneCard } from "./PhoneCard";
import EditPhoneForm from "@/components/EditPhoneForm";
import AddPhoneForm from "@/components/AddPhoneForm";
import AddBrandForm from "@/components/AddBrandForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type Props = {
  brandId: number;
  pageSize?: number;
  onBrandsChanged?: () => void;
};

export default function ProductList({ brandId, pageSize = 6, onBrandsChanged }: Props) {
  const [phones, setPhones] = useState<PhoneResponseDto[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search, 300);
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<{
    id: number;
    initial: { name: string; price: number; description: string; imageUrl: string };
  } | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);

  const isAdmin = typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [brandId, debounced, pageSize]);

  const loadPage = useCallback(
    async (p: number) => {
      const q = debounced || undefined;
      const rows = await PhoneClient.getPhones(brandId, q, p, pageSize);
      setPhones(rows ?? []);
      return rows ?? [];
    },
    [brandId, debounced, pageSize]
  );

  useEffect(() => {
    loadPage(page).catch(() => setPhones([]));
  }, [loadPage, page]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this phone?")) return;
    try {
      await PhoneClient.deletePhone(id);
      const updated = await loadPage(page);
      if (updated.length === 0 && page > 1) {
        const prev = page - 1;
        setPage(prev);
        await loadPage(prev);
      }
    } catch {
      alert("Failed to delete. Please try again.");
    }
  }

  async function handleNextPage() {
    const nextPage = page + 1;
    const nextRows = await PhoneClient.getPhones(brandId, debounced || undefined, nextPage, pageSize);
    if (nextRows && nextRows.length > 0) {
      setPage(nextPage);
      setPhones(nextRows);
    } // else do nothing (don’t go to empty page)
  }

  async function handlePrevPage() {
    if (page > 1) {
      const prev = page - 1;
      const prevRows = await PhoneClient.getPhones(brandId, debounced || undefined, prev, pageSize);
      setPage(prev);
      setPhones(prevRows ?? []);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-6xl">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAddBrand(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Brand
            </Button>
            <Button onClick={() => setShowCreate(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>
        )}
      </div>

      {/* grid */}
      {phones.length === 0 ? (
        <div className="grid place-items-center h-40 text-gray-600">No products found.</div>
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

      {/* pagination */}
      <div className="mt-4 flex justify-center items-center gap-3">
        <Button variant="outline" disabled={page <= 1} onClick={handlePrevPage}>
          Previous
        </Button>
        <span className="text-sm text-gray-700">Page {page}</span>
        <Button variant="outline" onClick={handleNextPage}>
          Next
        </Button>
      </div>

      {/* modals */}
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

      {showCreate && (
        <div className="fixed inset-0 bg-black/80 grid place-items-center p-4 z-50">
          <AddPhoneForm
            onSuccess={async () => {
              setShowCreate(false);
              setPage(1);
              await loadPage(1);
            }}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}

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
