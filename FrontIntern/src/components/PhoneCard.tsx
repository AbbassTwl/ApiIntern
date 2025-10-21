type PhoneCardProps = {
  name: string; brand: string; image: string; price: number; desc?: string[];
  isAdmin?: boolean; onEdit?: () => void; onDelete?: () => void; };

export function PhoneCard({
  name,brand,image,price,desc,isAdmin,
  onEdit, onDelete,}: PhoneCardProps) {
  
    return (
    <div className="w-[280px] bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image}
          loading="lazy"
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="text-xs text-gray-500">{brand}</div>
        <h2 className="text-lg font-semibold mt-0.5">{name}</h2>
        <p className="text-xl font-bold text-blue-600 mt-2">
          ${price.toFixed(2)}
        </p>

        {desc?.length ? (
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            {desc.map((line, i) => (
              <li key={i}>• {line}</li>
            ))}
          </ul>
        ) : null}

        {isAdmin && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm border bg-green-600 rounded text-white hover:bg-green-700"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PhoneCard;