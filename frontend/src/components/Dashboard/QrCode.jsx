import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Download,
  Share2,
  Link as LinkIcon,
  Check,
  Copy,
  QrCode as QrIcon,
  Hotel,
  ScanLine,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useCall } from "../../Provider/Provider";

const QrCode = () => {
  const { user } = useCall();

  const qrRef = useRef(null);

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const websiteUrl = import.meta.env.VITE_FRONTEND_URL;

  // Fixed: removed the extra }
  const qrValue = `${websiteUrl}/userInfo`;

  // ---------------------------------------------------------
  // Build high-quality printable QR card
  // ---------------------------------------------------------
  const buildCanvas = () => {
    return new Promise((resolve, reject) => {
      try {
        const sourceCanvas = qrRef.current?.querySelector("canvas");

        if (!sourceCanvas) {
          reject(new Error("QR canvas not found"));
          return;
        }

        // Premium card dimensions
        const cardW = 400;
        const cardH = 560;

        const scale = 3;

        const out = document.createElement("canvas");

        out.width = cardW * scale;
        out.height = cardH * scale;

        const ctx = out.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        ctx.scale(scale, scale);

        // -----------------------------------------------------
        // Helpers
        // -----------------------------------------------------

        const roundRect = (x, y, w, h, r) => {
          ctx.beginPath();
          ctx.moveTo(x + r, y);

          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);

          ctx.closePath();
        };

        // -----------------------------------------------------
        // Colors
        // -----------------------------------------------------

        const navy = "#0F2747";
        const navyDark = "#091A30";
        const gold = "#C8A45D";
        const goldLight = "#E6CA8A";
        const cream = "#FAF8F3";
        const white = "#FFFFFF";

        // -----------------------------------------------------
        // Background
        // -----------------------------------------------------

        roundRect(0, 0, cardW, cardH, 24);

        const backgroundGradient = ctx.createLinearGradient(
          0,
          0,
          cardW,
          cardH,
        );

        backgroundGradient.addColorStop(0, navy);
        backgroundGradient.addColorStop(0.55, "#15385F");
        backgroundGradient.addColorStop(1, navyDark);

        ctx.fillStyle = backgroundGradient;
        ctx.fill();

        // -----------------------------------------------------
        // Gold top accent
        // -----------------------------------------------------

        ctx.fillStyle = gold;

        roundRect(0, 0, cardW, 7, 24);
        ctx.fill();

        // -----------------------------------------------------
        // Hotel name
        // -----------------------------------------------------

        ctx.textAlign = "center";

        ctx.fillStyle = white;
        ctx.font = "600 29px Georgia, serif";

        const hotelName = "TARAINN";
        ctx.fillText(hotelName, cardW / 2, 50);

        // HOTEL
        ctx.fillStyle = goldLight;
        ctx.font = "600 12px Arial, sans-serif";

        // Manual letter spacing approximation
        ctx.fillText("H O T E L", cardW / 2, 70);

        // -----------------------------------------------------
        // Decorative line
        // -----------------------------------------------------

        ctx.strokeStyle = "rgba(230, 202, 138, 0.7)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(65, 88);
        ctx.lineTo(cardW - 65, 88);
        ctx.stroke();

        // -----------------------------------------------------
        // QR white container
        // -----------------------------------------------------

        const qrSize = 250;
        const qrPadding = 15;

        const boxSize = qrSize + qrPadding * 2;

        const boxX = (cardW - boxSize) / 2;
        const boxY = 105;

        roundRect(boxX, boxY, boxSize, boxSize, 16);

        ctx.fillStyle = white;
        ctx.fill();

        // QR itself
        ctx.drawImage(
          sourceCanvas,
          boxX + qrPadding,
          boxY + qrPadding,
          qrSize,
          qrSize,
        );

        // -----------------------------------------------------
        // Scan text
        // -----------------------------------------------------

        const scanY = boxY + boxSize + 34;

        ctx.fillStyle = goldLight;
        ctx.font = "600 11px Arial, sans-serif";

        ctx.fillText("SCAN TO CONNECT", cardW / 2, scanY);

        ctx.fillStyle = white;
        ctx.font = "600 20px Georgia, serif";

        ctx.fillText("Guest Call Service", cardW / 2, scanY + 25);

        // -----------------------------------------------------
        // Bottom divider
        // -----------------------------------------------------

        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(45, 490);
        ctx.lineTo(cardW - 45, 490);
        ctx.stroke();

        // -----------------------------------------------------
        // Website
        // -----------------------------------------------------

        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.font = "12px Arial, sans-serif";

        ctx.fillText(websiteUrl, cardW / 2, 515);

        // -----------------------------------------------------
        // Powered by CallBell
        // -----------------------------------------------------

        ctx.fillStyle = goldLight;
        ctx.font = "600 11px Arial, sans-serif";

        ctx.fillText("POWERED BY CALLBELL", cardW / 2, 538);

        resolve({
          canvas: out,
          width: cardW,
          height: cardH,
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // ---------------------------------------------------------
  // Copy URL
  // ---------------------------------------------------------

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // ---------------------------------------------------------
  // iOS detection
  // ---------------------------------------------------------

  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" &&
        navigator.maxTouchPoints > 1)
    );
  };

  // ---------------------------------------------------------
  // Download PDF
  // ---------------------------------------------------------

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const { canvas, width, height } = await buildCanvas();

      const imgData = canvas.toDataURL("image/png");

      const margin = 24;

      const pdfW = width + margin * 2;
      const pdfH = height + margin * 2;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfW, pdfH],
        hotfixes: ["px_scaling"],
      });

      // PDF background
      pdf.setFillColor(245, 243, 238);

      pdf.rect(0, 0, pdfW, pdfH, "F");

      // Soft shadow
      pdf.setFillColor(210, 207, 198);

      pdf.roundedRect(
        margin + 5,
        margin + 7,
        width,
        height,
        14,
        14,
        "F",
      );

      // Card
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        width,
        height,
      );

      const filename = `${(
        user?.name || "tarainn-hotel"
      ).replace(/\s+/g, "_")}_qr.pdf`;

      if (isIOS()) {
        const pdfOutput = pdf.output("bloburl");

        window.open(pdfOutput, "_blank");
      } else {
        pdf.save(filename);
      }
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  // ---------------------------------------------------------
  // Share QR
  // ---------------------------------------------------------

  const handleShare = async () => {
    try {
      const { canvas } = await buildCanvas();

      const filename = `${(
        user?.name || "tarainn-hotel"
      ).replace(/\s+/g, "_")}_qr.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          handleDownload();
          return;
        }

        const file = new File([blob], filename, {
          type: "image/png",
        });

        if (
          navigator.canShare &&
          navigator.canShare({
            files: [file],
          })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: "Tarainn Hotel QR Code",
              text: `Scan to connect with Tarainn Hotel`,
            });
          } catch (error) {
            if (error.name !== "AbortError") {
              console.error("Share failed:", error);
            }
          }
        } else {
          handleDownload();
        }
      }, "image/png");
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="w-full">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="px-5 sm:px-6 lg:px-8 pt-6 pb-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F2747] to-[#1B496F] flex items-center justify-center shadow-sm">
                <QrIcon className="w-5 h-5 text-[#E6CA8A]" />
              </div>

              <div>
                <h1
                  className="text-2xl sm:text-3xl text-gray-900"
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 600,
                  }}
                >
                  QR Code
                </h1>

                <p className="text-sm text-gray-500 mt-0.5">
                  Guest connection QR code
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Ready to use
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="p-5 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
          {/* =================================================
              LEFT INFORMATION
          ================================================== */}

          <div className="space-y-6">
            {/* Introduction */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-[#FAF8F3] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#0F2747] flex items-center justify-center">
                  <Hotel className="w-5 h-5 text-[#E6CA8A]" />
                </div>

                <div>
                  <h2
                    className="text-xl text-gray-900"
                    style={{
                      fontFamily:
                        "'Cormorant Garamond', Georgia, serif",
                      fontWeight: 600,
                    }}
                  >
                    Guest Call QR Code
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 leading-6">
                    Place this QR code in guest rooms, reception
                    areas, tables, or other convenient locations.
                    Guests can scan it to quickly connect with the
                    hotel service.
                  </p>
                </div>
              </div>
            </div>

            {/* URL Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="w-4 h-4 text-[#B28A3E]" />

                <p className="text-sm font-semibold text-gray-900">
                  Guest URL
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                  <p className="text-sm text-gray-600 break-all font-mono">
                    {qrValue}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white hover:bg-[#FAF8F3] text-gray-700 hover:text-[#0F2747] transition-all font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* How to use */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#F7F1E5] flex items-center justify-center">
                  <ScanLine className="w-4 h-4 text-[#B28A3E]" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    How to use
                  </h3>

                  <p className="text-xs text-gray-500">
                    Recommended placement
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    number: "01",
                    title: "Download",
                    text: "Download the QR card as a printable PDF.",
                  },
                  {
                    number: "02",
                    title: "Print",
                    text: "Print and place it where guests can easily see it.",
                  },
                  {
                    number: "03",
                    title: "Connect",
                    text: "Guests scan the code to access the call service.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="rounded-xl bg-gray-50 border border-gray-100 p-4"
                  >
                    <span
                      className="text-lg text-[#B28A3E]"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 700,
                      }}
                    >
                      {item.number}
                    </span>

                    <h4 className="font-semibold text-gray-900 mt-1">
                      {item.title}
                    </h4>

                    <p className="text-xs text-gray-500 mt-1 leading-5">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT QR PREVIEW
          ================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Preview Header */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    QR Preview
                  </h3>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Printable guest card
                  </p>
                </div>

                <div className="w-8 h-8 rounded-lg bg-[#F7F1E5] flex items-center justify-center">
                  <QrIcon className="w-4 h-4 text-[#B28A3E]" />
                </div>
              </div>
            </div>

            {/* QR Card */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-[#FAF8F3]">
              <div className="flex justify-center">
                <div
                  className="relative overflow-hidden rounded-[22px] shadow-2xl"
                  style={{
                    background:
                      "linear-gradient(145deg, #0F2747, #15385F, #091A30)",
                    width: 270,
                    padding: "22px 20px 24px",
                  }}
                >
                  {/* Gold accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8A45D]" />

                  {/* Hotel */}
                  <div className="text-center mb-3">
                    <p
                      className="text-white text-2xl"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 600,
                      }}
                    >
                      TARAINN
                    </p>

                    <p className="text-[#E6CA8A] text-[9px] font-semibold tracking-[0.35em] mt-0.5">
                      H O T E L
                    </p>
                  </div>

                  <div className="h-px bg-[#C8A45D]/40 mb-4" />

                  {/* QR */}
                  <div
                    ref={qrRef}
                    className="flex justify-center rounded-2xl overflow-hidden"
                    style={{
                      background: "#FFFFFF",
                      padding: 12,
                    }}
                  >
                    <QRCodeCanvas
                      value={qrValue}
                      size={190}
                      bgColor="#FFFFFF"
                      fgColor="#0F2747"
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  {/* Scan */}
                  <div className="text-center mt-4">
                    <p className="text-[#E6CA8A] text-[9px] font-semibold tracking-[0.25em]">
                      SCAN TO CONNECT
                    </p>

                    <p
                      className="text-white text-lg mt-1"
                      style={{
                        fontFamily:
                          "'Cormorant Garamond', Georgia, serif",
                        fontWeight: 600,
                      }}
                    >
                      Guest Call Service
                    </p>
                  </div>

                  <div className="h-px bg-white/15 mt-4 mb-3" />

                  <p className="text-white/60 text-[8px] text-center truncate">
                    {websiteUrl}
                  </p>

                  <p className="text-[#E6CA8A] text-[8px] text-center font-semibold tracking-[0.15em] mt-2">
                    POWERED BY CALLBELL
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-gray-100 space-y-3">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#0F2747] hover:bg-[#15385F] text-white font-semibold transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />

                {downloading
                  ? "Preparing PDF..."
                  : "Download QR PDF"}
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-[#FAF8F3] text-gray-700 hover:text-[#0F2747] font-semibold transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCode;