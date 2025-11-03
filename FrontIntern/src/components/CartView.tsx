import { useCart } from "@/context/useCart";
import type { Product } from "@/context/types";

export default function CartView() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="bg-white rounded shadow-md p-4">
      <h2 className="font-bold text-lg mb-3">🛒 Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <>
          <ul className="space-y-1">
            {cartItems.map((item: Product, index: number) => (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-1"
              >
                <span>
                  {item.name} — ${item.price}
                </span>
                <button
                  onClick={() => removeFromCart(item.name)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
