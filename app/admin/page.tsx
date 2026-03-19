'use client';

import { useEffect, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================
type User = { id: string; email: string; role: string; name: string | null; phone: string | null };
// Đã thêm trường highlight vào type Collection
type Collection = { id: string; name: string; description: string | null; thumbnail: string | null; highlight: boolean };
type Glass = { id: string; name: string; description: string | null; price: number; collectionId: string; images: string[] };

function formatVND(v: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
}

// ============================================================================
// MAIN COMPONENT (TABS ROUTER)
// ============================================================================
export default function AdminPage() {
  const [tab, setTab] = useState<'glasses' | 'collection' | 'users'>('glasses');

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Quản lý toàn bộ dữ liệu hệ thống (Yêu cầu quyền ADMIN).</p>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-border pb-2 overflow-x-auto">
          <button
            onClick={() => setTab('glasses')}
            className={`px-4 py-2 font-bold rounded-t-lg whitespace-nowrap ${tab === 'glasses' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary'}`}
          >
            Mắt Kính (Glasses)
          </button>
          <button
            onClick={() => setTab('collection')}
            className={`px-4 py-2 font-bold rounded-t-lg whitespace-nowrap ${tab === 'collection' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary'}`}
          >
            Bộ Sưu Tập (collection)
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 font-bold rounded-t-lg whitespace-nowrap ${tab === 'users' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary'}`}
          >
            Tài Khoản (Users)
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'glasses' && <GlassTab />}
        {tab === 'collection' && <CollectionTab />}
        {tab === 'users' && <UserTab />}
      </div>
    </main>
  );
}

// ============================================================================
// 1. GLASS TAB (KẾ THỪA API /api/product)
// ============================================================================
function GlassTab() {
  const [items, setItems] = useState<Glass[]>([]);
  const [collection, setcollection] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [images, setImages] = useState<FileList | null>(null);

  const fetchList = async () => {
    setLoading(true); setMsg(null);
    try {
      const [resGlass, resCol] = await Promise.all([
        fetch('/api/products?page=1&limit=50', { cache: 'no-store' }),
        fetch('/api/collection', { cache: 'no-store' }) // Sửa lại thành số nhiều theo api bạn đã gửi
      ]);
      const dataGlass = await resGlass.json();
      const dataCol = await resCol.json();
      
      if (dataGlass.success) setItems(dataGlass.items);
      if (dataCol.success) setcollection(dataCol.items);
    } catch (e: any) {
      setMsg(e?.message || 'Lỗi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const createItem = async () => {
    if (!name || !price || !collectionId) return setMsg('Thiếu thông tin bắt buộc');
    setLoading(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('description', description);
      fd.append('price', price);
      fd.append('collectionId', collectionId);
      
      if (images) {
        for (let i = 0; i < images.length; i++) {
          fd.append('images', images[i]);
        }
      }

      const res = await fetch('/api/products', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      setName(''); setDescription(''); setPrice(''); setCollectionId(''); setImages(null);
      await fetchList();
      setMsg('Thêm mắt kính thành công!');
    } catch (e: any) {
      setMsg(e?.message || 'Lỗi tạo mới');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Xóa mắt kính này?')) return;
    setLoading(true);
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' }); // Điều chỉnh đường dẫn nếu cần
      await fetchList();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {msg && <div className="p-3 bg-secondary border border-border rounded-lg">{msg}</div>}
      
      {/* Create Form */}
      <div className="p-5 bg-card border border-border rounded-xl">
        <h2 className="font-bold mb-4">Thêm Mắt Kính Mới</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-3 border rounded bg-background" placeholder="Tên kính" value={name} onChange={e => setName(e.target.value)} />
          <input className="p-3 border rounded bg-background" placeholder="Giá (VND)" type="number" value={price} onChange={e => setPrice(e.target.value)} />
          <input className="p-3 border rounded bg-background" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
          <select className="p-3 border rounded bg-background" value={collectionId} onChange={e => setCollectionId(e.target.value)}>
            <option value="">-- Chọn Bộ Sưu Tập --</option>
            {collection.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Upload Ảnh (Chọn nhiều ảnh)</label>
            <input type="file" multiple accept="image/*" className="w-full p-2 border rounded bg-background" onChange={e => setImages(e.target.files)} />
          </div>
        </div>
        <button onClick={createItem} disabled={loading} className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded-lg">
          {loading ? 'Đang xử lý...' : 'Tạo mới'}
        </button>
      </div>

      {/* List */}
      <div className="p-5 bg-card border border-border rounded-xl">
        <h2 className="font-bold mb-4">Danh sách Mắt Kính</h2>
        <div className="space-y-3">
          {items.map(p => (
            <div key={p.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-bold">{p.name}</p>
                <p className="text-sm text-muted-foreground">{formatVND(p.price)}</p>
              </div>
              <button onClick={() => deleteItem(p.id)} className="px-3 py-1 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20">Xóa</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. COLLECTION TAB
// ============================================================================
function CollectionTab() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  
  // Thêm state highlight
  const [highlight, setHighlight] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collection'); // Cập nhật sang collection
      const data = await res.json();
      if (data.success) setItems(data.items);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchList(); }, []);

  const createItem = async () => {
    if (!name) return setMsg('Thiếu tên bộ sưu tập');
    setLoading(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('description', description);
      
      // Gắn thêm highlight vào form data
      fd.append('highlight', String(highlight));

      if (thumbnail) fd.append('thumbnail', thumbnail);

      const res = await fetch('/api/collection', { method: 'POST', body: fd }); // Cập nhật sang collection
      if (res.ok) {
        setName(''); setDescription(''); setThumbnail(null); setHighlight(false);
        await fetchList();
        setMsg('Đã thêm bộ sưu tập!');
      }
    } catch (e) {
      setMsg('Lỗi tạo mới');
    } finally { setLoading(false); }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Xóa bộ sưu tập này?')) return;
    setLoading(true);
    await fetch(`/api/collection/${id}`, { method: 'DELETE' }); // Cập nhật sang collection
    await fetchList();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {msg && <div className="p-3 bg-secondary rounded">{msg}</div>}
      <div className="p-5 bg-card border rounded-xl">
        <h2 className="font-bold mb-4">Thêm Bộ Sưu Tập</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-3 border rounded bg-background" placeholder="Tên BST" value={name} onChange={e => setName(e.target.value)} />
          <input className="p-3 border rounded bg-background" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
          
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Ảnh đại diện (Thumbnail)</label>
            <input type="file" accept="image/*" className="w-full p-2 border rounded bg-background" onChange={e => setThumbnail(e.target.files?.[0] || null)} />
          </div>

          {/* Cụm checkbox Highlight */}
          <div className="md:col-span-2 flex items-center space-x-2 mt-2">
            <input 
              type="checkbox" 
              id="highlight" 
              checked={highlight} 
              onChange={e => setHighlight(e.target.checked)} 
              className="w-5 h-5 accent-primary cursor-pointer"
            />
            <label htmlFor="highlight" className="cursor-pointer select-none font-medium">
              Hiển thị lên phần "Bộ sưu tập nổi bật" ở Trang chủ
            </label>
          </div>

        </div>
        <button onClick={createItem} disabled={loading} className="mt-4 px-5 py-2 bg-primary text-primary-foreground rounded">
          {loading ? 'Đang xử lý...' : 'Thêm mới'}
        </button>
      </div>

      <div className="p-5 bg-card border rounded-xl">
        <h2 className="font-bold mb-4">Danh sách Bộ Sưu Tập</h2>
        <div className="space-y-3">
          {items.map(c => (
            <div key={c.id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <p className="font-bold flex items-center gap-2">
                  {c.name}
                  {/* Badge hiển thị nếu là nổi bật */}
                  {c.highlight && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-yellow-400 text-yellow-900 rounded">
                      Nổi bật
                    </span>
                  )}
                </p>
                {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
              </div>
              <button onClick={() => deleteItem(c.id)} className="px-3 py-1 bg-red-500/10 text-red-500 rounded">Xóa</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. USER TAB
// ============================================================================
function UserTab() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users'); // CHÚ Ý: Đảm bảo bạn đã có API này ở Backend
      const data = await res.json();
      if (data.success) setItems(data.items);
    } catch {
      // Bỏ qua lỗi hiển thị để không làm phiền nếu API chưa hoàn thiện
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchList(); }, []);

  const changeRole = async (id: string, newRole: string) => {
    setLoading(true);
    try {
      await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      await fetchList();
    } finally { setLoading(false); }
  };

  return (
    <div className="p-5 bg-card border rounded-xl">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">Quản lý User</h2>
        <button onClick={fetchList} className="text-sm px-3 py-1 bg-secondary rounded">Làm mới</button>
      </div>
      
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">Chưa có dữ liệu hoặc API /api/users chưa được tạo.</p>
      ) : (
        <div className="space-y-3">
          {items.map(u => (
            <div key={u.id} className="flex justify-between items-center p-4 border rounded">
              <div>
                <p className="font-bold">{u.email}</p>
                <p className="text-sm text-muted-foreground">{u.name || 'No name'} • {u.phone || 'No phone'}</p>
              </div>
              <select 
                className="p-2 border rounded bg-background" 
                value={u.role} 
                onChange={e => changeRole(u.id, e.target.value)}
                disabled={loading}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}