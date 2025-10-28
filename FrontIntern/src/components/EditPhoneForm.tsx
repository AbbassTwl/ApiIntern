import { useEffect, useRef, useState } from "react";
import { BrandClient } from "../Client/Brand.client";
import { PhoneClient } from "../Client/Phone.client";
import type { BrandResponseDto } from "../Dto/Brand.dto";
import type { PhoneRequestDto, PhoneResponseDto } from "../Dto/Phone.dto";
import { X } from "lucide-react";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const nameToMatch = (initial?.brandName || fetchedBrandName).toLowerCase();
    if (!nameToMatch || brands.length === 0) return;
    const match = brands.find((b) => b.name.toLowerCase() === nameToMatch);
    if (match) setBrandId(match.id);
  }, [brands, brandId, initial?.brandId, initial?.brandName, fetchedBrandName]);

  // Simulated upload (replace with real upload API returning a URL)
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await new Promise((res) => setTimeout(res, 800)); // simulate latency
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

   // e.preventDefault keep the app in control when form submitted — no page reload, no default behavior, just the custom logic. 
   
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name) return alert("Name is required.");
    if (price === "" || Number(price) <= 0) return alert("Price must be greater than 0.");
    if (brandId === "") return alert("Please choose a brand.");

    const dto: PhoneRequestDto = {
      name: name,
      price: Number(price),
      description: description,
      imageUrl: imageUrl,
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
    <div className="max-w-xl w-full bg-white rounded-2xl shadow p-5 max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Edit phone</h2>

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
            min={0}
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
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

        <div className="block">
          <div className="text-sm mb-1">Image URL (optional)</div>
          <div className="flex items-center gap-2">
            <input
              className="w-full border rounded px-3 py-2"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://…"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="editFileInput"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 border rounded hover:bg-gray-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUrl && (
            <div className="relative inline-block mt-3">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-40 rounded border object-contain"
              />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-1 right-1 bg-white border rounded-full p-0.5 shadow hover:bg-gray-100"
                title="Remove image"
              >
                <X size={14} className="text-gray-700" />
              </button>
            </div>
          )}
        </div>

        <label className="block">
          <div className="text-sm mb-1">Description</div>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="flex gap-2 pt-1">
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
    </div>
  );
}
