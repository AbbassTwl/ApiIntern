import { useCart } from "@/context/useCart";
import type { Product } from "@/context/types";

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const total = cartItems.reduce(
    (sum, item: Product) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛒 My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="bg-white rounded-xl shadow divide-y">
            {cartItems.map((item: Product, idx: number) => (
              <li
                key={idx}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.brand}</div>
                </div>

                <div className="flex items-center gap-3">
                  {/* ✅ Quantity controls */}
                  <button
                    onClick={() => decreaseQuantity(item.name)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    –
                  </button>
                  <span className="font-semibold">{item.quantity || 1}</span>
                  <button
                    onClick={() => increaseQuantity(item.name)}
                    className="px-2 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>

                  <div className="font-semibold">${item.price}</div>
                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-end">
            <div className="text-lg font-bold">Total: ${total}</div>
          </div>
        </>
      )}
    </div>
  );
}
