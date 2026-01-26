'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/providers/app-provider';

type Mode = 'login' | 'register';

type Props = {
  open: boolean;
  mode: Mode;
  onClose: () => void;
};

export function AuthModal({ open, mode, onClose }: Props) {
    const { setUser } = useApp();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Mode>(mode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTab(mode);
    setMsg(null);
  }, [mode, open]);

  // khóa scroll body khi mở modal
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // esc to close
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, loading, onClose]);

  const register = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
          phone: phone || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.message || 'Register failed');

      setMsg('Đăng ký thành công. Giờ bạn đăng nhập nhé.');
      setTab('login');
    } catch (e: any) {
      setMsg(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
  setLoading(true);
  setMsg(null);

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // backend chuẩn nên trả { success: true, user: {...}, token?: ... }
    if (!res.ok || !data?.success) {
      throw new Error(data?.message || 'Login failed');
    }

    // LƯU USER để Header đổi "Login/Register" -> tên user
    // user nên có: { id, email, name, role }
    if (data?.user) {
      setUser(data.user);
    } else {
      // nếu backend của bạn chưa trả user, vẫn login được nhưng header không đổi tên
      // lúc đó bạn cần sửa backend login trả user về
      throw new Error('Login ok nhưng thiếu user trong response');
    }

    onClose();

    // admin thì chuyển sang /admin
    if (data.user.role === 'ADMIN') {
      router.push('/admin');
    }
  } catch (e: any) {
    setMsg(e?.message || 'Error');
  } finally {
    setLoading(false);
  }
};


  const submit = async () => {
    if (tab === 'register') return register();
    return login();
  };

  if (!open || !mounted) return null;

  const ui = (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => !loading && onClose()}
      />

      {/* wrapper center */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* modal */}
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-auto">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {tab === 'login' ? 'Login' : 'Register'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {tab === 'login' ? 'Đăng nhập để tiếp tục.' : 'Tạo tài khoản mới trong vài giây.'}
              </p>
            </div>

            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={() => !loading && onClose()}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setTab('login')}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg border border-border ${
                tab === 'login' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab('register')}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg border border-border ${
                tab === 'register' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {msg && (
            <div className="mb-4 text-sm border border-border bg-secondary/40 rounded-lg p-3">
              {msg}
            </div>
          )}

          <div className="space-y-3">
            {tab === 'register' && (
              <>
                <input
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
                <input
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </>
            )}

            <input
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all"
            >
              {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}
