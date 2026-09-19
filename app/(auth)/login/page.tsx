"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useLogin } from "@/app/hooks/useAuth";
import { LoginFormData, loginSchema } from "@/app/schemas/auth.schema";
import { AuthMarketingPanel } from "../components/AuthMarketingPanel";


export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [showPassword, setShowPassword] =
    useState(false);
  const [serverError, setServerError] =
    useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    try {
      const response =
        await loginMutation.mutateAsync(data);

      toast.success(response.message);

      router.replace("/dashboard");
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
                Bon retour
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Connectez-vous à votre espace Shipora
                pour gérer votre activité logistique.
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
              className="mt-8 space-y-5"
            >
              {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {serverError}
                </div>
              )}

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
                      form.formState.errors.email
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                        : "border-slate-200 focus:border-[#1677FF] focus:ring-blue-100"
                    }`}
                  />
                </div>

                {form.formState.errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {
                      form.formState.errors.email
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mot de passe
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-[#1677FF] transition hover:text-[#0B5ED7]"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    {...form.register("password")}
                    className={`h-12 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      form.formState.errors.password
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

                {form.formState.errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {
                      form.formState.errors.password
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="flex h-12 w-full items-center justify-center cursor-pointer gap-2 rounded-lg bg-[#1677FF] text-sm font-semibold text-white transition hover:bg-[#0B5ED7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </motion.form>

            {/* Register */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.25,
              }}
              className="mt-8 text-center text-sm text-slate-500"
            >
              Vous n'avez pas encore de compte ?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#1677FF] hover:text-[#0B5ED7]"
              >
                Créer un compte
              </Link>
            </motion.p>

            <p className="mt-10 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Shipora.
              Tous droits réservés.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}