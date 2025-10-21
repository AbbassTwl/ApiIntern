import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { BrandClient } from "../Client/Brand.client";
import { PhoneClient } from "../Client/Phone.client";
import type { BrandResponseDto } from "../Dto/Brand.dto";
import type { PhoneRequestDto } from "../Dto/Phone.dto";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function AddPhoneForm({ onSuccess, onCancel }: Props) {
  const [brands, setBrands] = useState<BrandResponseDto[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [brandId, setBrandId] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    BrandClient.getBrands(undefined, undefined, 1, 100)
      .then((data) => setBrands(data ?? []))
      .catch(() => setBrands([]));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
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
      await PhoneClient.createPhone(dto);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to create phone. Please try again.");
    }
  }

  return (
    <div className="max-w-xl w-full bg-white border rounded-2xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Add phone</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <div className="text-sm mb-1">Name</div>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Price (USD)</div>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            min={0}
            step="0.01"
            required
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Brand</div>
          <select
            className="w-full border rounded px-3 py-2 bg-white"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value === "" ? "" : Number(e.target.value))}
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

        <label className="block">
          <div className="text-sm mb-1">Image URL</div>
          <input
            className="w-full border rounded px-3 py-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
          />
        </label>

        <label className="block">
          <div className="text-sm mb-1">Description</div>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            Save
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="bg-red-600 text-white hover:bg-red-700">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
