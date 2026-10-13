"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FolderTree,
  X,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Sparkles,
  Package,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchCategories() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories?includeInactive=true");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load categories");
      setCategories(data.categories || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData(emptyForm);
    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category ${name}?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Catalog</p>
          <h1 className="text-2xl font-black text-foreground mt-1">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize the DK Power wholesale catalog.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-primary text-white hover:bg-accent font-bold text-xs px-6 py-3 rounded-full shadow-md hover:shadow-primary/25 gap-2 cursor-pointer transition-all duration-300 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex gap-2 items-center">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." className="pl-9" />
      </div>

      <div className="sm:hidden space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-white rounded-sm border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping inline-block mr-2" />
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-500 bg-white rounded-sm border border-gray-200">
            No categories found. Click &quot;Add Category&quot; to create one.
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const productCount = cat._count?.products ?? 0;
            return (
              <div key={cat.id} className="p-4 rounded-sm bg-white border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-sm bg-background border border-gray-200 overflow-hidden shrink-0">
                    {cat.imageUrl ? (
                      <Image src={cat.imageUrl} alt={cat.name} fill sizes="48px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground"><FolderTree className="w-5 h-5" /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-gray-950 truncate">{cat.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">/{cat.slug} • Order #{cat.sortOrder}</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${cat.isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-secondary text-gray-600 border-gray-200"}`}>
                    {cat.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-xs font-bold text-gray-700 bg-background px-2.5 py-1 rounded-full border border-gray-200">{productCount} products</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => handleOpenEdit(cat)} className="p-1.5 rounded-sm bg-background border border-gray-200 text-gray-700 hover:text-black" aria-label={`Edit ${cat.name}`}><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-600" aria-label={`Delete ${cat.name}`}><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="hidden sm:block bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider bg-background">
                <th className="py-4 px-4">Category Details</th>
                <th className="py-4 px-4">Slug Identifier</th>
                <th className="py-4 px-4">Sort Order</th>
                <th className="py-4 px-4">Active Products</th>
                <th className="py-4 px-4">Storefront Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr><td colSpan={6} className="py-16 text-center text-gray-500"><div className="inline-flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-ping" /><span>Loading categories...</span></div></td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-gray-500">No categories found. Click &quot;Add Category&quot; to create one.</td></tr>
              ) : (
                filteredCategories.map((cat) => {
                  const productCount = cat._count?.products ?? 0;
                  return (
                    <tr key={cat.id} className="hover:bg-secondary/80 transition-colors group">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md border border-gray-200 bg-background overflow-hidden shrink-0">
                            {cat.imageUrl ? <Image src={cat.imageUrl} alt={cat.name} fill sizes="40px" className="object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-muted-foreground" /></div>}
                          </div>
                          <div><div className="font-bold text-gray-950">{cat.name}</div><div className="text-[10px] text-gray-500 line-clamp-1 max-w-[260px]">{cat.description || "No description"}</div></div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-gray-500">/{cat.slug}</td>
                      <td className="py-4 px-4 font-bold text-gray-700">#{cat.sortOrder}</td>
                      <td className="py-4 px-4"><span className="font-bold text-gray-900">{productCount}</span></td>
                      <td className="py-4 px-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cat.isActive ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-secondary text-gray-600 border-gray-200"}`}>{cat.isActive ? "Active" : "Hidden"}</span></td>
                      <td className="py-4 px-4"><div className="flex justify-end gap-2"><button onClick={() => handleOpenEdit(cat)} className="p-2 rounded-md border border-gray-200 hover:bg-background" aria-label={`Edit ${cat.name}`}><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(cat.id, cat.name)} className="p-2 rounded-md border border-red-100 text-red-600 hover:bg-red-50" aria-label={`Delete ${cat.name}`}><Trash2 className="w-4 h-4" /></button></div></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div><h2 className="text-lg font-black">{editingCategory ? "Edit Category" : "Add Category"}</h2><p className="text-xs text-muted-foreground mt-1">Manage wholesale catalog grouping.</p></div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-secondary" aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
              <div className="space-y-2"><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="fast-chargers" /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Sort Order</Label><Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} /></div><label className="flex items-end gap-2 pb-2 text-sm font-semibold"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label></div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3"><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={isSaving || !formData.name.trim() || !formData.slug.trim()} className="bg-primary text-white hover:bg-accent">{isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{editingCategory ? "Save Changes" : "Create Category"}</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
