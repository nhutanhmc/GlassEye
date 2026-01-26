'use client';

import { useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  inStock: number;
  isActive: boolean;
  imageUrl?: string | null;
};

function formatVND(v: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
}

export default function AdminPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // create form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [inStock, setInStock] = useState('0');
  const [image, setImage] = useState<File | null>(null);

  // edit modal simple
  const [editing, setEditing] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSalePrice, setEditSalePrice] = useState('');
  const [editInStock, setEditInStock] = useState('0');
  const [editIsActive, setEditIsActive] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/products?page=1&limit=50', { cache: 'no-store' });
      const data = await res.json();
      if (!data?.success) throw new Error('Fetch failed');
      setItems(data.items || []);
    } catch (e: any) {
      setItems([]);
      setMsg(e?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const createProduct = async () => {
    setMsg(null);
    if (!name.trim()) return setMsg('Missing name');
    if (!price.trim()) return setMsg('Missing price');
    if (!image) return setMsg('Missing image');

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('price', price.trim());
    if (salePrice.trim()) fd.append('salePrice', salePrice.trim());
    fd.append('inStock', inStock.trim() || '0');
    fd.append('image', image);

    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Create failed');

      setName('');
      setPrice('');
      setSalePrice('');
      setInStock('0');
      setImage(null);

      await fetchList();
      setMsg('Created ✅');
    } catch (e: any) {
      setMsg(e?.message || 'Create failed (Bạn đã login ADMIN chưa?)');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setEditName(p.name);
    setEditPrice(String(p.price));
    setEditSalePrice(p.salePrice ? String(p.salePrice) : '');
    setEditInStock(String(p.inStock ?? 0));
    setEditIsActive(Boolean(p.isActive));
    setMsg(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/products/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          price: Number(editPrice),
          salePrice: editSalePrice.trim() ? Number(editSalePrice) : null,
          inStock: Number(editInStock),
          isActive: editIsActive,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Update failed');

      setEditing(null);
      await fetchList();
      setMsg('Updated ✅');
    } catch (e: any) {
      setMsg(e?.message || 'Update failed (ADMIN only)');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Delete failed');
      await fetchList();
      setMsg('Deleted ✅');
    } catch (e: any) {
      setMsg(e?.message || 'Delete failed (ADMIN only)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin</h1>
        <p className="text-muted-foreground mb-6">
          Create / Edit / Delete products. (Chỉ ADMIN mới làm được)
        </p>

        {msg && (
          <div className="mb-6 border border-border bg-secondary/40 rounded-lg p-3 text-sm">
            {msg}
          </div>
        )}

        {/* Create */}
        <div className="border border-border rounded-xl p-5 bg-card mb-10">
          <h2 className="text-lg font-bold mb-4">Create product</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="px-4 py-3 border border-border rounded-lg bg-background"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <input
              className="px-4 py-3 border border-border rounded-lg bg-background"
              placeholder="Price (VND)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading}
            />
            <input
              className="px-4 py-3 border border-border rounded-lg bg-background"
              placeholder="Sale price (optional)"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              disabled={loading}
            />
            <input
              className="px-4 py-3 border border-border rounded-lg bg-background"
              placeholder="In stock"
              value={inStock}
              onChange={(e) => setInStock(e.target.value)}
              disabled={loading}
            />
            <input
              type="file"
              accept="image/*"
              className="px-4 py-3 border border-border rounded-lg bg-background md:col-span-2"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              disabled={loading}
            />
          </div>

          <button
            onClick={createProduct}
            disabled={loading}
            className="mt-4 px-5 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
          >
            {loading ? 'Working...' : 'Create'}
          </button>
        </div>

        {/* List */}
        <div className="border border-border rounded-xl p-5 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Products</h2>
            <button
              onClick={fetchList}
              disabled={loading}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No products</p>
          ) : (
            <div className="space-y-3">
              {items.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 border border-border rounded-lg p-4">
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate">{p.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatVND(p.salePrice ?? p.price)} • stock: {p.inStock} • {p.isActive ? 'Active' : 'Hidden'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="px-3 py-2 border border-border rounded-lg hover:bg-secondary"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => !loading && setEditing(null)} />
            <div className="relative w-[92vw] max-w-lg bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold">Edit product</h3>
                <button onClick={() => !loading && setEditing(null)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="px-4 py-3 border border-border rounded-lg bg-background"
                  placeholder="Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={loading}
                />
                <input
                  className="px-4 py-3 border border-border rounded-lg bg-background"
                  placeholder="Price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  disabled={loading}
                />
                <input
                  className="px-4 py-3 border border-border rounded-lg bg-background"
                  placeholder="Sale price (optional)"
                  value={editSalePrice}
                  onChange={(e) => setEditSalePrice(e.target.value)}
                  disabled={loading}
                />
                <input
                  className="px-4 py-3 border border-border rounded-lg bg-background"
                  placeholder="In stock"
                  value={editInStock}
                  onChange={(e) => setEditInStock(e.target.value)}
                  disabled={loading}
                />

                <label className="flex items-center gap-2 text-sm md:col-span-2">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    disabled={loading}
                  />
                  Active (show on website)
                </label>
              </div>

              <div className="mt-5 flex gap-2 justify-end">
                <button
                  onClick={() => setEditing(null)}
                  disabled={loading}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                * Edit này chưa đổi ảnh. Nếu muốn đổi ảnh, mình sẽ thêm PATCH multipart cho image.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
