'use client';

import Image from "next/image";
import { useApp } from "@/components/providers/app-provider";

function formatVND(v: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
}

export default function CartPage() {
  const { cart, cartQty, updateQty, removeFromCart, clearCart } = useApp();

  const total = cart.reduce((sum, it) => {
    const price = (it.salePrice ?? it.price) || 0;
    return sum + price * it.qty;
  }, 0);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cart</h1>
            <p className="text-muted-foreground">Items: {cartQty}</p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary"
            >
              Clear cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="border border-border rounded-xl p-8 bg-card text-muted-foreground">
            Cart is empty.
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((it) => {
              const unit = (it.salePrice ?? it.price) || 0;
              return (
                <div key={it.id} className="flex gap-4 items-center border border-border rounded-xl p-4 bg-card">
                  <div className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden">
                    <Image
                      src={it.imageUrl || "/placeholder.svg"}
                      alt={it.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground truncate">{it.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatVND(unit)} / item
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) => updateQty(it.id, Math.max(1, Number(e.target.value)))}
                      className="w-20 h-10 px-3 border border-border rounded-lg bg-background"
                    />
                    <button
                      onClick={() => removeFromCart(it.id)}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-secondary"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="w-36 text-right font-bold text-foreground">
                    {formatVND(unit * it.qty)}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end mt-6">
              <div className="w-full md:w-96 border border-border rounded-xl p-5 bg-card">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Total</span>
                  <span className="font-bold text-foreground">{formatVND(total)}</span>
                </div>

                <button className="mt-3 w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90">
                  Checkout (later)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
