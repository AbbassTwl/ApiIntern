import { useEffect, useState, useCallback } from "react";
import type { PhoneResponseDto } from "../Dto/Phone.dto";
import { PhoneClient } from "../Client/Phone.client";
import SearchBar from "./SearchBar";
import { PhoneCard } from "./PhoneCard";
import EditPhoneForm from "../components/EditPhoneForm";
import AddPhoneForm from "../components/AddPhoneForm";
import AddBrandForm from "../components/AddBrandForm";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

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
  const [hasNextPage, setHasNextPage] = useState(true);

  const [editing, setEditing] = useState<{
    id: number;
    initial: { name: string; price: number; description: string; imageUrl: string };} | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showAddBrand, setShowAddBrand] = useState(false);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // reset to first page (and re-enable Next) when brand/search/pagesize changes
  useEffect(() => {
    setPage(1);
    setHasNextPage(true);
  }, [brandId, debounced, pageSize]);

  // load phones for the current filters and page +  next page
  const loadPage = useCallback(
    async (pageNumber: number) => {

      const fetchedPhones  = await PhoneClient.getPhones(

        brandId,
        debounced || undefined,
        pageNumber,
        pageSize
      );

      const current = fetchedPhones  ?? [];
      
      setPhones(current);

      // next page once to know if Next should be enabled
      const nextPage = pageNumber + 1;
      const nextPageItems = await PhoneClient.getPhones(
        brandId,
        debounced || undefined,
        nextPage,
        pageSize
      );
      setHasNextPage(!!nextPageItems && nextPageItems.length > 0);

      return current;
    },
    [brandId, debounced, pageSize]
  );

  // auto load phones when page or filters change
  useEffect(() => {
    loadPage(page).catch(() => {
      setPhones([]);
      setHasNextPage(false);
    });
  }, [loadPage, page]);

  // delete phone and reload (go back if current page becomes empty)
  async function handleDelete(id: number) {
    if (!confirm("Delete this phone?")) return;
    try {
      await PhoneClient.deletePhone(id);
      const updated = await loadPage(page);
      if (updated.length === 0 && page > 1) {
        const prev = page - 1;
        setPage(prev); 
      }
    } catch {
      alert("Failed to delete. Please try again.");
    }
  }

  // pagination – handlers only change the page; loadPage handles data + hasNextPage
  function handleNextPage() {
    if (hasNextPage) setPage((p) => p + 1);
  }

  function handlePrevPage() {
    if (page > 1) setPage((p) => p - 1);
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-6xl mx-auto">
      {/* top bar  search - add brand products*/}
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

      {/* phones */}
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
        <Button variant="outline" disabled={!hasNextPage} onClick={handleNextPage}>
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
