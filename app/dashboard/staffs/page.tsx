"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Pencil, Plus, RefreshCw, Search, Trash2, Users, X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { createStaff, deleteStaff, getStaff, updateStaff, type CreateStaffInput, type StaffMember, type StaffRole } from "@/app/services/staff.service";

const roles: StaffRole[] = ["ADMIN", "MANAGER", "AGENT", "ACCOUNTANT"];
const emptyForm: CreateStaffInput = { name: "", email: "", password: "", role: "AGENT" };
const roleLabels: Record<StaffRole, string> = { OWNER: "Propriétaire", ADMIN: "Administrateur", MANAGER: "Manager", AGENT: "Agent", ACCOUNTANT: "Comptable" };

export default function StaffsPage() {
  const { user } = useAuth();
  const canManage = user?.role === "OWNER" || user?.role === "ADMIN";
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [form, setForm] = useState<CreateStaffInput>(emptyForm);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<StaffMember | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadStaff() {
    setLoading(true);
    try { const response = await getStaff(); setStaff(response.data); }
    catch { setError("Impossible de charger le staff."); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadStaff(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setOpen(true); }
  function openEdit(member: StaffMember) { setEditing(member); setForm({ name: member.name, email: member.email, password: "", role: member.role }); setOpen(true); }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (editing) await updateStaff(editing.id, { name: form.name, email: form.email, role: form.role, ...(form.password ? { password: form.password } : {}) });
      else await createStaff(form);
      setOpen(false); await loadStaff();
    } catch { setError("Impossible d'enregistrer ce membre."); }
    finally { setSaving(false); }
  }

  async function confirmDelete() {
    if (!memberToDelete) return;
    try { await deleteStaff(memberToDelete.id); setMemberToDelete(null); await loadStaff(); }
    catch { setError("Impossible de supprimer ce membre."); }
  }

  async function toggleActive(member: StaffMember) {
    try { await updateStaff(member.id, { isActive: !member.isActive }); await loadStaff(); }
    catch { setError("Impossible de modifier le statut."); }
  }

  const visibleStaff = staff.filter((member) => `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FF]"><Users className="h-5 w-5 text-[#1677FF]" /></div><h1 className="text-2xl font-bold tracking-tight text-slate-950">Staff</h1></div><p className="text-sm text-slate-500">Gérez les utilisateurs de votre organisation.</p></div>
        {canManage && <button type="button" onClick={openCreate} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1677FF] px-4 text-sm font-medium text-white hover:bg-[#0B5ED7]"><Plus className="h-4 w-4" />Ajouter un membre</button>}
      </div>

      {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="relative w-full sm:max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un membre..." className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#1677FF]" /></div><div className="flex items-center gap-3"><span className="text-sm text-slate-500">{visibleStaff.length} membre{visibleStaff.length > 1 ? "s" : ""}</span><button type="button" onClick={loadStaff} disabled={loading} className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Actualiser</button></div></div>
        {loading ? <div className="p-6 text-sm text-slate-500">Chargement...</div> : visibleStaff.length === 0 ? <div className="p-12 text-center text-sm text-slate-500">Aucun membre du staff.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[760px]"><thead><tr className="border-b border-slate-200 bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th className="px-5 py-3">Membre</th><th className="px-5 py-3">Rôle</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Ajouté le</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody>{visibleStaff.map((member) => <tr key={member.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"><td className="px-5 py-4"><p className="text-sm font-semibold text-slate-800">{member.name}</p><p className="text-xs text-slate-500">{member.email}</p></td><td className="px-5 py-4"><span className="rounded-full bg-[#EAF3FF] px-2.5 py-1 text-xs font-medium text-[#1677FF]">{roleLabels[member.role]}</span></td><td className="px-5 py-4"><button disabled={!canManage} type="button" onClick={() => toggleActive(member)} className={`rounded-full px-2.5 py-1 text-xs font-medium ${member.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{member.isActive ? "Actif" : "Désactivé"}</button></td><td className="px-5 py-4 text-sm text-slate-600">{formatDate(member.createdAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-1">{canManage && <><button type="button" onClick={() => openEdit(member)} title="Modifier" className="rounded-lg p-2 text-slate-400 hover:bg-[#EAF3FF] hover:text-[#1677FF]"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => toggleActive(member)} title="Modifier le statut" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal className="h-4 w-4" /></button><button type="button" onClick={() => setMemberToDelete(member)} title="Supprimer" className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></>}</div></td></tr>)}</tbody></table></div>}
      </div>

      {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4"><form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-950">{editing ? "Modifier le membre" : "Ajouter un membre"}</h2><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-slate-700">Nom<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3" /></label><label className="text-sm text-slate-700">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3" /></label><label className="text-sm text-slate-700">Mot de passe<input required={!editing} minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3" /></label><label className="text-sm text-slate-700">Rôle<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as StaffRole })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3">{roles.map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></label></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Annuler</button><button disabled={saving} className="rounded-lg bg-[#1677FF] px-4 py-2 text-sm text-white">{saving ? "Enregistrement..." : editing ? "Enregistrer" : "Créer"}</button></div></form></div>}
      {memberToDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"><h2 className="text-lg font-semibold text-slate-950">Supprimer ce membre ?</h2><p className="mt-2 text-sm text-slate-500">Le compte de <strong>{memberToDelete.name}</strong> sera définitivement supprimé.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setMemberToDelete(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Annuler</button><button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Supprimer</button></div></div></div>}
    </main>
  );
}

function formatDate(value: string) { return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)); }
