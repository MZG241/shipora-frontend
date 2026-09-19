"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RegisterFormData, registerSchema } from "@/app/schemas/auth.schema";
import { useRegister } from "@/app/hooks/useAuth";
import { AuthMarketingPanel } from "../components/AuthMarketingPanel";



export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [showPassword, setShowPassword] =
    useState(false);
  const [serverError, setServerError] =
    useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      organizationName: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    try {
      const response =
        await registerMutation.mutateAsync(data);

      toast.success(response.message);

      // Le backend ne connecte pas automatiquement
      // l'utilisateur après l'inscription.
      router.replace("/login");
    } catch (error: unknown) {
      const responseError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        responseError.response?.data?.message ??
        "Une erreur est survenue. Veuillez réessayer.";

      setServerError(message);
      toast.error(message);
    }
  }

  const errors = form.formState.errors;

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Marketing */}
        <AuthMarketingPanel />

        {/* Formulaire */}
        <section className="flex min-h-screen w-full items-center justify-center px-6 py-10 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo mobile */}
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1677FF]">
                    <span className="text-lg font-bold text-white">
                      S
                    </span>
                  </div>

                  <span className="text-xl font-bold text-slate-900">
                    Shipora
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Créez votre compte
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Créez votre espace Shipora et commencez
                à gérer votre activité logistique.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={form.handleSubmit(onSubmit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.1,
              }}
              className="mt-7 space-y-4"
            >
              {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {serverError}
                </div>
              )}

              {/* Nom */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nom complet
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jean Dupont"
                    {...form.register("name")}
                    className={`h-12 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.name
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1677FF] focus:ring-blue-100"
                    }`}
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Organisation */}
              <div>
                <label
                  htmlFor="organizationName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nom de l'entreprise
                </label>

                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="organizationName"
                    type="text"
                    autoComplete="organization"
                    placeholder="Mon entreprise"
                    {...form.register(
                      "organizationName",
                    )}
                    className={`h-12 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.organizationName
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1677FF] focus:ring-blue-100"
                    }`}
                  />
                </div>

                {errors.organizationName && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {
                      errors.organizationName
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Adresse email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="vous@entreprise.com"
                    {...form.register("email")}
                    className={`h-12 w-full rounded-lg border bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1677FF] focus:ring-blue-100"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mot de passe
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Minimum 8 caractères"
                    {...form.register("password")}
                    className={`h-12 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1677FF] focus:ring-blue-100"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}

                {!errors.password && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Utilisez au moins 8 caractères.
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1677FF] text-sm font-semibold text-white transition hover:bg-[#0B5ED7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {registerMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Création...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.form>

            {/* Login */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.25,
              }}
              className="mt-7 text-center text-sm text-slate-500"
            >
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#1677FF] transition hover:text-[#0B5ED7]"
              >
                Se connecter
              </Link>
            </motion.p>

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              En créant un compte, vous acceptez les
              conditions d'utilisation de Shipora.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}