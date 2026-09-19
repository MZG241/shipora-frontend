"use client";

import { useEffect, useState } from "react";
import { Building2, ImagePlus, Save } from "lucide-react";
import {
  getOrganization,
  updateOrganization,
  type Organization,
  type OrganizationInput,
} from "@/app/services/organization.service";

const emptyForm: OrganizationInput = {
  name: "",
  description: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  country: "",
  currency: "XAF",
};

const fields = [
  ["name", "Nom de l'organisation"],
  ["email", "Email"],
  ["phone", "Téléphone"],
  ["address", "Adresse"],
  ["city", "Ville"],
  ["country", "Pays"],
] as const;

export default function SettingsPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [form, setForm] = useState<OrganizationInput>(emptyForm);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getOrganization()
      .then(({ data }) => {
        setOrganization(data);
        setForm({
          name: data.name,
          description: data.description ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          city: data.city ?? "",
          address: data.address ?? "",
          country: data.country ?? "",
          currency: data.currency,
        });
      })
      .catch(() => setError("Impossible de charger l'organisation."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const { data } = await updateOrganization(form, logo);
      setOrganization(data);
      setLogo(null);
      setMessage("Paramètres enregistrés.");
    } catch {
      setError("Impossible d'enregistrer les paramètres.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field: keyof OrganizationInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (loading) {
    return <main className="p-8 text-sm text-slate-500">Chargement des paramètres...</main>;
  }

  return (
    <main className="space-y-6">
      <header>
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3FF]">
            <Building2 className="h-5 w-5 text-[#1677FF]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Paramètres de l'organisation
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          Ces informations apparaissent sur vos documents et factures.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Identité et coordonnées</h2>
          <p className="mt-1 text-sm text-slate-500">
            Complétez les informations officielles de votre organisation.
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
              {logo ? (
                <img src={URL.createObjectURL(logo)} alt="Aperçu du logo" className="h-full w-full object-contain" />
              ) : organization?.logo ? (
                <img src={organization.logo} alt={`Logo de ${organization.name}`} className="h-full w-full object-contain" />
              ) : (
                <ImagePlus className="h-7 w-7 text-slate-400" />
              )}
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Choisir un logo
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} />
              </label>
              <p className="mt-2 text-xs text-slate-400">PNG, JPG ou WebP. Le logo sera affiché sur les factures.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([field, label]) => (
              <label key={field} className="text-sm font-medium text-slate-700">
                {label}
                <input required={field === "name"} type={field === "email" ? "email" : "text"} value={form[field] ?? ""} onChange={(event) => updateField(field, event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 font-normal outline-none focus:border-[#1677FF] focus:ring-2 focus:ring-[#1677FF]/10" />
              </label>
            ))}
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">
              Description
              <textarea value={form.description ?? ""} onChange={(event) => updateField("description", event.target.value)} maxLength={1000} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none focus:border-[#1677FF]" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Devise
              <input required value={form.currency} onChange={(event) => updateField("currency", event.target.value.toUpperCase())} maxLength={10} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 font-normal uppercase outline-none focus:border-[#1677FF]" />
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <span className={`text-sm ${error ? "text-red-600" : "text-emerald-600"}`}>{error || message}</span>
            <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#1677FF] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0B5ED7] disabled:opacity-50">
              <Save className="h-4 w-4" />
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
