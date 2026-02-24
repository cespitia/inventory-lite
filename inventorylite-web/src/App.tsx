import { useEffect, useMemo, useState } from "react";
import type { Product } from "./api";
import { createProduct, deleteProduct, getProducts, updateProduct } from "./api";
import "./App.css";

type Draft = { name: string; category: string; price: string; quantity: string };
type Toast = { type: "success" | "error"; msg: string };

function emptyDraft(): Draft {
  return { name: "", category: "", price: "0", quantity: "0" };
}

export default function App() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<Toast | null>(null);

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [q, setQ] = useState("");

  function showToast(type: Toast["type"], msg: string) {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 2500);
  }

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setItems(data);
    } catch (e: any) {
      const msg = e?.message ?? "Error";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) =>
      [p.name, p.category].some((x) => (x ?? "").toLowerCase().includes(s))
    );
  }, [items, q]);

  function startEdit(p: Product) {
    setMode("edit");
    setEditId(p.id);
    setDraft({
      name: p.name,
      category: p.category ?? "",
      price: String(p.price),
      quantity: String(p.quantity),
    });
    setError(null);
  }

  function resetForm() {
    setMode("create");
    setEditId(null);
    setDraft(emptyDraft());
    setError(null);
  }

  function validate(d: Draft): string | null {
    if (!d.name.trim()) return "Name is required.";
    const price = Number(d.price);
    const qty = Number(d.quantity);
    if (Number.isNaN(price) || price < 0) return "Price must be a non-negative number.";
    if (!Number.isInteger(qty) || qty < 0) return "Quantity must be a non-negative integer.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const v = validate(draft);
    if (v) {
      setError(v);
      showToast("error", v);
      return;
    }

    setError(null);

    const payload = {
      name: draft.name.trim(),
      category: draft.category.trim(),
      price: Number(draft.price),
      quantity: Number(draft.quantity),
    };

    try {
      if (mode === "create") {
        await createProduct(payload);
        showToast("success", "Product created.");
      } else if (mode === "edit" && editId != null) {
        await updateProduct(editId, payload);
        showToast("success", "Product updated.");
      }

      resetForm();
      await refresh();
    } catch (e: any) {
      const msg = e?.message ?? "Error";
      setError(msg);
      showToast("error", msg);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);
      showToast("success", "Product deleted.");
      await refresh();
    } catch (e: any) {
      const msg = e?.message ?? "Error";
      setError(msg);
      showToast("error", msg);
    }
  }

  return (
    <div className="container">
      <header className="top">
        <div>
          <h1>InventoryLite</h1>
          <p className="sub">ASP.NET Core Web API + React SPA (Azure-ready MVP)</p>
        </div>
        <div className="actions">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or category..."
          />
          <button className="btn" onClick={refresh} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      {error && <div className="alert">{error}</div>}

      <section className="grid">
        <div className="card">
          <h2>{mode === "create" ? "Add Product" : `Edit Product #${editId}`}</h2>

          <form onSubmit={onSubmit} className="form">
            <label>
              Name
              <input
                className="input"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>

            <label>
              Category
              <input
                className="input"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              />
            </label>

            <div className="row">
              <label>
                Price
                <input
                  className="input"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                />
              </label>

              <label>
                Quantity
                <input
                  className="input"
                  value={draft.quantity}
                  onChange={(e) => setDraft({ ...draft, quantity: e.target.value })}
                />
              </label>
            </div>

            <div className="row">
              <button className="btn primary" type="submit">
                {mode === "create" ? "Create" : "Save"}
              </button>
              <button className="btn" type="button" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Products</h2>

          {loading ? (
            <p className="muted">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="muted">No products found.</p>
          ) : (
            <div className="table">
              <div className="thead">
                <div>Name</div>
                <div>Category</div>
                <div>Price</div>
                <div>Qty</div>
                <div></div>
              </div>

              {filtered.map((p) => (
                <div className="trow" key={p.id}>
                  <div className="strong">{p.name}</div>
                  <div className="muted">{p.category || "-"}</div>
                  <div>${Number(p.price).toFixed(2)}</div>
                  <div>{p.quantity}</div>
                  <div className="end">
                    <button className="btn small" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="btn small danger" onClick={() => onDelete(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="foot">
        <span className="muted">Tip: demo Swagger first, then the SPA.</span>
      </footer>
    </div>
  );
}