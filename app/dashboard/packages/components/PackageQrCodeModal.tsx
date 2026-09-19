"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Loader2,
  QrCode,
  X,
} from "lucide-react";

import { getPackageBarcode } from "@/app/services/package.service";

type PackageQrCodeModalProps = {
  packageId: string;
  trackingCode: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function PackageQrCodeModal({
  packageId,
  trackingCode,
  isOpen,
  onClose,
}: PackageQrCodeModalProps) {
  const [imageUrl, setImageUrl] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let objectUrl: string | null = null;

    async function loadQrCode() {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await getPackageBarcode(packageId);

        objectUrl = URL.createObjectURL(
          response.data,
        );

        setImageUrl(objectUrl);
      } catch {
        setError(
          "Impossible de charger le QR code.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadQrCode();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      setImageUrl(null);
    };
  }, [packageId, isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleDownload() {
    if (!imageUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = imageUrl;
    link.download = `${trackingCode}-qr-code.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 cursor-pointer bg-black/40"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <QrCode size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                QR Code
              </h2>

              <p className="text-xs text-zinc-500">
                Code du package
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center px-5 py-6">
          {isLoading && (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <Loader2
                size={26}
                className="animate-spin text-blue-600"
              />

              <p className="text-sm text-zinc-500">
                Chargement...
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex h-64 items-center justify-center text-center">
              <p className="text-sm text-red-500">
                {error}
              </p>
            </div>
          )}

          {imageUrl &&
            !isLoading &&
            !error && (
              <>
                <div className="rounded-xl border border-zinc-200 bg-white p-4">
                  <img
                    src={imageUrl}
                    alt={`QR code ${trackingCode}`}
                    className="h-56 w-56 object-contain"
                  />
                </div>

                <p className="mt-4 font-mono text-sm font-semibold text-zinc-800">
                  {trackingCode}
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Scannez ce code pour identifier le package.
                </p>
              </>
            )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!imageUrl}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}

