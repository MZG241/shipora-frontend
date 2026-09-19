"use client";

import {
  BrowserQRCodeReader,
  IScannerControls,
} from "@zxing/browser";

import type { Result } from "@zxing/library";

import {
  Camera,
  ImagePlus,
  Loader2,
  QrCode,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getPackageByTrackingCode,
} from "@/app/services/package.service";

import type {
  PackageWithShipment,
} from "@/app/types/package.types";

type PackageScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PackageScannerModal({
  isOpen,
  onClose,
}: PackageScannerModalProps) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const controlsRef =
    useRef<IScannerControls | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const readerRef =
    useRef<BrowserQRCodeReader | null>(null);

  const isProcessingRef =
    useRef(false);

  const [isStartingCamera, setIsStartingCamera] =
    useState(false);

  const [isReadingImage, setIsReadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [result, setResult] =
    useState<PackageWithShipment | null>(null);

  /* =========================
     STOP CAMERA
  ========================= */

  function stopCamera() {
    controlsRef.current?.stop();
    controlsRef.current = null;

    const video = videoRef.current;

    if (video?.srcObject) {
      const stream =
        video.srcObject as MediaStream;

      stream.getTracks().forEach((track) => {
        track.stop();
      });

      video.srcObject = null;
    }

    isProcessingRef.current = false;
  }

  /* =========================
     CLOSE
  ========================= */

  function handleClose() {
    stopCamera();

    setError("");
    setResult(null);
    setIsStartingCamera(false);
    setIsReadingImage(false);

    onClose();
  }

  /* =========================
     TRACKING CODE
  ========================= */

  async function handleTrackingCode(
    trackingCode: string,
  ) {
    try {
      stopCamera();
      setError("");

      const normalizedCode =
        trackingCode.trim();

      if (!normalizedCode) {
        throw new Error(
          "TRACKING_CODE_EMPTY",
        );
      }

      const response =
        await getPackageByTrackingCode(
          normalizedCode,
        );

      console.log(
        "Scanner response:",
        response.data,
      );

      const packageResult: PackageWithShipment =
        {
          ...response.data.package,
          shipment:
            response.data.shipment,
        };

      setResult(packageResult);
    } catch (error) {
      console.error(
        "Scanner error:",
        error,
      );

      setResult(null);

      setError(
        "Package introuvable ou impossible de récupérer les informations.",
      );
    }
  }

  /* =========================
     START CAMERA
  ========================= */

  async function startCamera() {
    try {
      setError("");
      setResult(null);
      setIsStartingCamera(true);

      stopCamera();

      if (!videoRef.current) {
        throw new Error(
          "VIDEO_NOT_AVAILABLE",
        );
      }

      if (!readerRef.current) {
        readerRef.current =
          new BrowserQRCodeReader();
      }

      const controls =
        await readerRef.current.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          async (
            scanResult: Result | undefined,
          ) => {
            if (!scanResult) {
              return;
            }

            if (isProcessingRef.current) {
              return;
            }

            isProcessingRef.current = true;

            const trackingCode =
              scanResult.getText();

            await handleTrackingCode(
              trackingCode,
            );
          },
        );

      controlsRef.current = controls;
    } catch (error) {
      console.error(
        "Camera error:",
        error,
      );

      setError(
        "Impossible d'accéder à la caméra. Vérifiez les permissions du navigateur.",
      );
    } finally {
      setIsStartingCamera(false);
    }
  }

  /* =========================
     IMAGE UPLOAD
  ========================= */

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError("");
      setResult(null);
      setIsReadingImage(true);

      stopCamera();

      if (!readerRef.current) {
        readerRef.current =
          new BrowserQRCodeReader();
      }

      const imageUrl =
        URL.createObjectURL(file);

      try {
        const scanResult =
          await readerRef.current.decodeFromImageUrl(
            imageUrl,
          );

        const trackingCode =
          scanResult.getText();

        await handleTrackingCode(
          trackingCode,
        );
      } finally {
        URL.revokeObjectURL(imageUrl);
      }
    } catch (error) {
      console.error(
        "Image scan error:",
        error,
      );

      setError(
        "Aucun QR code valide n'a été trouvé dans cette image.",
      );
    } finally {
      setIsReadingImage(false);
      event.target.value = "";
    }
  }

  /* =========================
     SCAN ANOTHER
  ========================= */

  function handleScanAnother() {
    setResult(null);
    setError("");

    setTimeout(() => {
      startCamera();
    }, 100);
  }

  /* =========================
     EFFECT
  ========================= */

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Fermer"
        onClick={handleClose}
        className="absolute inset-0 cursor-pointer bg-black/40"
      />

      <div className="relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[calc(100dvh-32px)]">
        {/* =========================
            HEADER
        ========================= */}

        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <QrCode size={18} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-zinc-900">
                Scanner un package
              </h2>

              <p className="truncate text-xs text-zinc-500">
                Scannez le QR code du package
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="ml-3 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X size={17} />
          </button>
        </div>

        {/* =========================
            CONTENT
        ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!result && (
            <div className="p-4 sm:p-5">
              {/* CAMERA */}

              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950">
                <div className="relative h-[min(55dvh,420px)] min-h-[240px] w-full sm:h-[min(60dvh,460px)]">
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    autoPlay
                    className="h-full w-full object-cover"
                  />

                  {/* Scanner frame */}

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative h-48 w-48 sm:h-56 sm:w-56">
                      <div className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-blue-500" />

                      <div className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-blue-500" />

                      <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-blue-500" />

                      <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-blue-500" />

                      <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-blue-500/80" />
                    </div>
                  </div>

                  {/* CAMERA INACTIVE */}

                  {!isStartingCamera &&
                    !videoRef.current?.srcObject && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 px-6 text-center">
                        <Camera
                          size={30}
                          className="mb-3 text-zinc-500"
                        />

                        <p className="text-sm font-medium text-white">
                          Caméra inactive
                        </p>

                        <p className="mt-1 max-w-xs text-xs text-zinc-400">
                          Cliquez sur le bouton pour commencer
                        </p>
                      </div>
                    )}

                  {/* CAMERA LOADING */}

                  {isStartingCamera && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
                      <Loader2
                        size={28}
                        className="animate-spin text-blue-500"
                      />

                      <p className="mt-3 text-sm text-white">
                        Activation de la caméra...
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* START CAMERA */}

              <button
                type="button"
                onClick={startCamera}
                disabled={isStartingCamera}
                className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStartingCamera ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Camera size={17} />
                )}

                {isStartingCamera
                  ? "Activation..."
                  : "Scanner avec la caméra"}
              </button>

              {/* SEPARATOR */}

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />

                <span className="text-xs text-zinc-400">
                  OU
                </span>

                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              {/* IMAGE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* IMAGE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={isReadingImage}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReadingImage ? (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <ImagePlus size={17} />
                )}

                {isReadingImage
                  ? "Lecture de l'image..."
                  : "Téléverser une image"}
              </button>

              <p className="mt-3 text-center text-xs text-zinc-400">
                Utilisez une photo ou une capture contenant
                clairement le QR code.
              </p>

              {/* ERROR */}

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center">
                  <p className="text-sm leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* =========================
              RESULT
          ========================= */}

          {result && (
            <div className="p-4 sm:p-5">
              <div className="mb-5 flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <QrCode size={26} />
                </div>

                <h3 className="mt-3 text-sm font-semibold text-zinc-900">
                  Package trouvé
                </h3>

                <p className="mt-1 text-xs text-zinc-500">
                  Le QR code a été reconnu avec succès.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                {/* TRACKING */}

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Tracking
                  </p>

                  <p className="mt-1 break-all font-mono text-sm font-semibold text-zinc-900">
                    {result.trackingCode}
                  </p>
                </div>

                {/* PACKAGE INFO */}

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400">
                      Article
                    </p>

                    <p className="mt-1 break-words text-sm font-medium text-zinc-900">
                      {result.itemName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">
                      Quantité
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {result.quantity}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-zinc-400">
                      Expédition
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-medium text-zinc-900">
                      {result.shipment.trackingNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">
                      Statut
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {result.status}
                    </p>
                  </div>
                </div>

                {/* ROUTE */}

                <div className="mt-4 border-t border-zinc-200 pt-4">
                  <p className="text-xs text-zinc-400">
                    Trajet
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-zinc-900">
                    {result.shipment.origin}
                    {" → "}
                    {result.shipment.destination}
                  </p>
                </div>

                {/* WEIGHT */}

                {result.weight && (
                  <div className="mt-4 border-t border-zinc-200 pt-4">
                    <p className="text-xs text-zinc-400">
                      Poids
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {Number(result.weight)} kg
                    </p>
                  </div>
                )}
              </div>

              {/* SCAN AGAIN */}

              <button
                type="button"
                onClick={handleScanAnother}
                className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                <Camera size={17} />
                Scanner un autre package
              </button>
            </div>
          )}
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="flex shrink-0 justify-end border-t border-zinc-200 px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}