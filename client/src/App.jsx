import React, { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { ShoppingCart, Moon, Sun, Plus, Search } from "lucide-react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";

const API = "/api/items";

const priorityLabel = (p) => (p === 1 ? "Tinggi" : p === 2 ? "Normal" : "Rendah");

function priorityVariant(p) {
  if (p === 1) return "high";
  if (p === 2) return "normal";
  return "low";
}

function safeText(v) {
  return (v ?? "").toString();
}

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

function ItemForm({ initial, onSubmit, submitting }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [priority, setPriority] = useState(String(initial?.priority ?? 2));
  const [note, setNote] = useState(initial?.note ?? "");

  const canSubmit = name.trim().length > 0 && Number(quantity) >= 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    onSubmit({
      name: name.trim(),
      quantity: Number(quantity),
      unit: unit.trim() ? unit.trim() : null,
      category: category.trim() ? category.trim() : null,
      priority: Number(priority),
      note: note.trim() ? note.trim() : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Nama Item</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Beras" />
        </div>

        <div className="space-y-1">
          <Label>Jumlah</Label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1"
          />
        </div>

        <div className="space-y-1">
          <Label>Satuan (opsional)</Label>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="pcs / kg / liter" />
        </div>

        <div className="space-y-1">
          <Label>Kategori (opsional)</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Sembako / Minuman" />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label>Prioritas</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Tinggi</SelectItem>
              <SelectItem value="2">Normal</SelectItem>
              <SelectItem value="3">Rendah</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <Label>Catatan (opsional)</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Misal: cari yang diskon" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="submit" disabled={!canSubmit || submitting}>
          {submitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}

export default function App() {
  const { theme, setTheme } = useTheme();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showBought, setShowBought] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((it) => {
      const matchText =
        !query ||
        it.name.toLowerCase().includes(query) ||
        safeText(it.category).toLowerCase().includes(query) ||
        safeText(it.note).toLowerCase().includes(query);

      const matchCategory = categoryFilter === "all" ? true : (it.category ?? "") === categoryFilter;
      const matchBought = showBought ? true : it.bought === false;

      return matchText && matchCategory && matchBought;
    });
  }, [items, q, categoryFilter, showBought]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch (e) {
      toast.error("Tidak bisa memuat data. Pastikan server jalan.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function createItem(payload) {
    setSubmitting(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal menambah item");
      }
      setItems((prev) => [data, ...prev]);
      toast.success("Item ditambahkan");
      setCreateOpen(false);
    } catch (e) {
      toast.error(e.message || "Gagal menambah item");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateItem(id, payload) {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal update item");
      }
      setItems((prev) => prev.map((it) => (it.id === id ? data : it)));
      toast.success("Item diupdate");
      setEditOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error(e.message || "Gagal update item");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleBought(id) {
    const before = items;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, bought: !it.bought } : it)));

    try {
      const res = await fetch(`${API}/${id}/toggle`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Gagal toggle");
      setItems((prev) => prev.map((it) => (it.id === id ? data : it)));
    } catch (e) {
      setItems(before);
      toast.error(e.message || "Gagal toggle status");
    }
  }

  async function deleteItem(id) {
    const ok = confirm("Hapus item ini?");
    if (!ok) return;

    const before = items;
    setItems((prev) => prev.filter((it) => it.id !== id));

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Gagal hapus item");
      }
      toast.success("Item dihapus");
    } catch (e) {
      setItems(before);
      toast.error(e.message || "Gagal hapus item");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Toaster richColors position="top-right" />

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/75 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold leading-tight">Shopping Note</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">CRUD + UI modern</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Item</DialogTitle>
                  <DialogDescription>Catat kebutuhan belanja kamu biar rapi.</DialogDescription>
                </DialogHeader>
                <ItemForm onSubmit={createItem} submitting={submitting} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <Search className="h-4 w-4 opacity-70" />
              </div>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama/kategori/catatan..."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-[190px]">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "all" ? "Semua Kategori" : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={showBought} onCheckedChange={setShowBought} id="showBought" />
                <Label htmlFor="showBought">Tampilkan yang dibeli</Label>
              </div>

              <Button variant="secondary" onClick={fetchItems}>
                Refresh
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
            <div>Total: <span className="font-medium">{filtered.length}</span> item</div>
            <div>
              {loading ? "Memuat..." : "Siap"}
            </div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Prioritas</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-6" colSpan={6}>
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-zinc-500 dark:text-zinc-400" colSpan={6}>
                      Tidak ada data. Tambah item dulu ya.
                    </td>
                  </tr>
                ) : (
                  filtered.map((it) => (
                    <tr
                      key={it.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleBought(it.id)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            it.bought
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                              : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                          }`}
                          title="Klik untuk ubah status"
                        >
                          {it.bought ? "Dibeli" : "Belum"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`font-medium ${it.bought ? "line-through opacity-60" : ""}`}>
                          {it.name}
                        </div>
                        {it.note ? (
                          <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {it.note}
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {it.quantity} {it.unit ?? ""}
                      </td>
                      <td className="px-4 py-3">{it.category ?? "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={priorityVariant(it.priority)}>
                          {priorityLabel(it.priority)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setEditing(it);
                              setEditOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteItem(it.id)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditing(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>Perbarui data item belanja.</DialogDescription>
            </DialogHeader>
            {editing ? (
              <ItemForm
                initial={editing}
                submitting={submitting}
                onSubmit={(payload) => updateItem(editing.id, payload)}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Shopping Note</div>
          <div className="opacity-80">React + Tailwind + Express + Prisma + SQLite</div>
        </div>
      </footer>
    </div>
  );
}
