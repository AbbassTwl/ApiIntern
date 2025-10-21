import { useState } from "react";
import { Button } from "../components/ui/button";
import { BrandClient } from "../Client/Brand.client";
import type { BrandRequestDto } from "../Dto/Brand.dto";

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function AddBrandForm({ onSuccess, onCancel }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return alert("Name is required.");

    const dto: BrandRequestDto = {
      name: name.trim(),
      description: description.trim(),
    };

    try {
      await BrandClient.createBrand(dto);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to create brand. Please try again.");
    }
  }

  return (
    <div className="max-w-xl w-full bg-white border rounded-2xl shadow p-5">
      <h2 className="text-lg font-semibold mb-4">Add Brand</h2>

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
          <div className="text-sm mb-1">Description</div>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
