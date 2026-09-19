"use client";

import { useEffect, useState } from "react";
import { LockKeyhole, Save, UserRound } from "lucide-react";
import { getProfile, updateProfile, type ProfileInput } from "@/app/services/profile.service";

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileInput>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { getProfile().then((response) => setForm({ name: response.data.name, email: response.data.email, password: "" })).finally(() => setLoading(false)); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setMessage(""); try { await updateProfile({ ...form, ...(form.password ? {} : { password: undefined }) }); setForm((current) => ({ ...current, password: "" })); setMessage("Profil mis à jour."); } catch { setMessage("Impossible de mettre à jour le profil."); } finally { setSaving(false); } }
  if (loading) return <main className="p-8 text-sm text-slate-500">Chargement du profil...</main>;
  return <main className="max-w-3xl space-y-6"><div><div className="mb-2 flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FF]"><UserRound className="h-5 w-5 text-[#1677FF]" /></div><h1 className="text-2xl font-bold tracking-tight text-slate-950">Mon profil</h1></div><p className="text-sm text-slate-500">Modifiez vos informations personnelles et votre mot de passe.</p></div><form onSubmit={submit} className="space-y-5 overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Informations personnelles</h2></div><div className="grid gap-4 p-5 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Nom<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 font-normal focus:border-[#1677FF]" /></label><label className="text-sm font-medium text-slate-700">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 font-normal focus:border-[#1677FF]" /></label><label className="text-sm font-medium text-slate-700 sm:col-span-2"><span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" />Nouveau mot de passe</span><input minLength={8} type="password" value={form.password ?? ""} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Laisser vide pour conserver l'actuel" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 font-normal focus:border-[#1677FF]" /></label></div><div className="flex items-center justify-between border-t border-slate-100 px-5 py-4"><span className="text-sm text-emerald-600">{message}</span><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#1677FF] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Enregistrement..." : "Enregistrer"}</button></div></form></main>;
}
