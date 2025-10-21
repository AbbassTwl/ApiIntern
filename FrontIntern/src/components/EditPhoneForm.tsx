import { useEffect, useState } from "react";
import { BrandClient } from "../Client/Brand.client";
import { PhoneClient } from "../Client/Phone.client";
import type { BrandResponseDto } from "../Dto/Brand.dto";
import type { PhoneRequestDto, PhoneResponseDto } from "../Dto/Phone.dto";

type Props = {
  phoneId: number;
  initial?: Partial<
    Pick<PhoneResponseDto, "name" | "price" | "description" | "imageUrl" | "brandName">
  > & { brandId?: number };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function EditPhoneForm({ phoneId, initial, onSuccess, onCancel }: Props) {
  const [brands, setBrands] = useState<BrandResponseDto[]>([]);
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState<number | "">(initial?.price ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [brandId, setBrandId] = useState<number | "">(initial?.brandId ?? "");
  const [fetchedBrandName, setFetchedBrandName] = useState("");

  // Fetch available brands
  useEffect(() => {
    BrandClient.getBrands(undefined, undefined, 1, 100)
      .then((data) => setBrands(data ?? []))
      .catch(() => setBrands([]));
  }, []);

  // If no initial data provided, fetch phone info
  useEffect(() => {
    if (initial) return;
    PhoneClient.getPhone(phoneId)
      .then((p) => {
        setName(p.name ?? "");
        setPrice(p.price);
        setDescription(p.description ?? "");
        setImageUrl(p.imageUrl ?? "");
        setFetchedBrandName(p.brandName ?? "");
      })
      .catch(() => {});
  }, [phoneId, initial]);

  // Match brand by name if brandId not set
  useEffect(() => {
    if (brandId !== "") return;
    if (initial?.brandId) {
      setBrandId(initial.brandId);
      return;
    }
    const nameToMatch = (initial?.brandName || fetchedBrandName).trim().toLowerCase();
    if (!nameToMatch || brands.length === 0) return;
    const match = brands.find(
      (b) => b.name.trim().toLowerCase() === nameToMatch
    );
    if (match) setBrandId(match.id);
  }, [brands, brandId, initial?.brandId, initial?.brandName, fetchedBrandName]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required.");
    if (price === "" || Number(price) <= 0) return alert("Price must be greater than 0.");
    if (brandId === "") return alert("Please choose a brand.");

    const dto: PhoneRequestDto = {
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      brandId: Number(brandId),
    };

    try {
      await PhoneClient.updatePhone(phoneId, dto);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to update phone. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl w-full bg-white rounded-2xl shadow p-5"
    >
      <h2 className="text-lg font-semibold mb-4">Edit phone</h2>

      <label className="block mb-3">
        <div className="text-sm mb-1">Name</div>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="block mb-3">
        <div className="text-sm mb-1">Price (USD)</div>
        <input
          type="number"
          min={0}
          step="0.01"
          className="w-full border rounded px-3 py-2"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        />
      </label>

      <label className="block mb-3">
        <div className="text-sm mb-1">Brand</div>
        <select
          className="w-full border rounded px-3 py-2 bg-white"
          value={brandId}
          onChange={(e) =>
            setBrandId(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        >
          <option value="">Select brand…</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-3">
        <div className="text-sm mb-1">Image URL</div>
        <input
          className="w-full border rounded px-3 py-2"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </label>

      <label className="block mb-4">
        <div className="text-sm mb-1">Description</div>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700"
        >
          Save changes
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 border"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
