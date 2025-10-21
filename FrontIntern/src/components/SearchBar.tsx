import { Search } from "lucide-react";

export type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search phones…",
}: SearchBarProps) {
  return (
    <label
      className="w-full flex items-center gap-2 px-4 py-2 border rounded-xl cursor-text
      focus-within:ring-2 focus-within:ring-blue-500 bg-white"
    >
      {/*  Icon */}
      <Search className="h-5 w-5 text-gray-500" />

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
      />
    </label>
  );
}
