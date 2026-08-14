import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Share2, Link } from "lucide-react";
import { jsPDF } from "jspdf";

const QrCode = ({ user = {} }) => {
  const qrRef = useRef();

  const qrValue = `${import.meta.env.VITE_FRONTEND_URL}/userInfo?userId=${user?.id}&name=${encodeURIComponent(user?.name)}`;
  const websiteUrl = import.meta.env.VITE_FRONTEND_URL;

  const buildCanvas = () => {
    return new Promise((resolve) => {
      const sourceCanvas = qrRef.current.querySelector("canvas");

      // Card dimensions — credit-card aspect ratio (85.6mm × 54mm ≈ 1.585)
      // We'll use 400 × 560 px (portrait card)
      const cardW = 400;
      const cardH = 560;

      const out = document.createElement("canvas");
      // 2× for retina quality
      out.width = cardW * 2;
      out.height = cardH * 2;

      const ctx = out.getContext("2d");
      ctx.scale(2, 2);

      // ── Background ──────────────────────────────────────────────
      const cornerR = 22;
      const roundRect = (x, y, w, h, r) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };

      // Red card fill
      roundRect(0, 0, cardW, cardH, cornerR);
      ctx.fillStyle = "#E8202A";
      ctx.fill();

      // Subtle inner gradient overlay for depth
      const grad = ctx.createRadialGradient(cardW * 0.3, cardH * 0.2, 0, cardW * 0.5, cardH * 0.5, cardW * 0.9);
      grad.addColorStop(0, "rgba(255,80,80,0.25)");
      grad.addColorStop(1, "rgba(160,0,0,0.18)");
      roundRect(0, 0, cardW, cardH, cornerR);
      ctx.fillStyle = grad;
      ctx.fill();

      // ── Name ────────────────────────────────────────────────────
      if (user?.name) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 26px Georgia, serif";
        ctx.textAlign = "center";
        ctx.letterSpacing = "1px";
        let name = user.name;
        while (ctx.measureText(name).width > cardW - 60 && name.length > 3) {
          name = name.slice(0, -1);
        }
        if (name !== user.name) name += "…";
        ctx.fillText(name, cardW / 2, 58);
      }

      // ── QR White Box ─────────────────────────────────────────────
      const qrSize = 260;
      const qrPad = 14;         // white padding around qr
      const boxW = qrSize + qrPad * 2;
      const boxH = qrSize + qrPad * 2;
      const boxX = (cardW - boxW) / 2;
      const boxY = 82;

      // White rounded rectangle
      roundRect(boxX, boxY, boxW, boxH, 12);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();

      // Draw QR code centred inside the white box
      ctx.drawImage(sourceCanvas, boxX + qrPad, boxY + qrPad, qrSize, qrSize);

      // ── Divider line ─────────────────────────────────────────────
      const dividerY = boxY + boxH + 30;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, dividerY);
      ctx.lineTo(cardW - 40, dividerY);
      ctx.stroke();

      // ── Website URL ──────────────────────────────────────────────
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.font = "500 17px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.fillText(websiteUrl, cardW / 2, dividerY + 32);

      // ── SCAN FOR CALL ─────────────────────────────────────────────
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 28px Georgia, serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "3px";
      const callText = "SCAN FOR CALL";
      ctx.fillText(callText, cardW / 2, dividerY + 78);

      // Underline
      const textW = ctx.measureText(callText).width;
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cardW / 2 - textW / 2, dividerY + 84);
      ctx.lineTo(cardW / 2 + textW / 2, dividerY + 84);
      ctx.stroke();

      resolve({ canvas: out, width: cardW, height: cardH });
    });
  };

  // Detect iOS Safari
  const isIOS = () => {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  };

  const handleDownload = async () => {
    try {
      const { canvas, width, height } = await buildCanvas();
      const imgData = canvas.toDataURL("image/png");

      // PDF page exactly the card size with a small white margin
      const margin = 20;
      const pdfW = width + margin * 2;
      const pdfH = height + margin * 2;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfW, pdfH],
        hotfixes: ["px_scaling"],
      });

      // White background page
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, 0, pdfW, pdfH, "F");

      // Draw card centred with a soft shadow effect (draw dark rect slightly offset first)
      pdf.setFillColor(180, 10, 10);
      pdf.roundedRect(margin + 4, margin + 6, width, height, 12, 12, "F");

      // Draw the card image on top
      pdf.addImage(imgData, "PNG", margin, margin, width, height);

      const filename = `${(user?.name || "user").replace(/\s+/g, "_")}_callbell_qr.pdf`;

      if (isIOS()) {
        const pdfOutput = pdf.output("bloburl");
        window.open(pdfOutput, "_blank");
      } else {
        pdf.save(filename);
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const handleShare = async () => {
    try {
      const { canvas } = await buildCanvas();
      const filename = `${(user?.name || "user").replace(/\s+/g, "_")}_callbell_qr.png`;

      canvas.toBlob((blob) => {
        if (!blob) { handleDownload(); return; }
        const file = new File([blob], filename, { type: "image/png" });

        if (navigator.canShare?.({ files: [file] })) {
          navigator.share({
            files: [file],
            title: "CallBell QR Code",
            text: `Scan to connect with ${user?.name} — ${websiteUrl}`,
          }).catch((err) => {
            if (err.name !== "AbortError") handleDownload();
          });
        } else {
          handleDownload();
        }
      }, "image/png");
    } catch (err) {
      console.error("Share failed:", err);
      handleDownload();
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Scan for call with <span className="text-red-600">{user?.name}</span>
        </h2>
        <p className="text-gray-600">Share this QR code for quick connection</p>
      </div>

      {/* Preview card — mirrors the PDF design */}
      <div className="flex justify-center mb-6">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: "#E8202A", width: 240, padding: "20px 20px 24px" }}>

          {user?.name && (
            <p className="text-white font-bold text-center text-lg mb-3 tracking-wide"
              style={{ fontFamily: "Georgia, serif" }}>
              {user.name}
            </p>
          )}

          <div ref={qrRef}
            className="flex justify-center rounded-xl overflow-hidden"
            style={{ background: "#fff", padding: 10 }}>
            <QRCodeCanvas
              value={qrValue}
              size={160}
              bgColor="#FFFFFF"
              fgColor="#E8202A"
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="mt-4 border-t border-white border-opacity-30 pt-3 text-center">
            <p className="text-white text-opacity-85 text-xs font-mono mb-1">{websiteUrl}</p>
            <p className="text-white font-bold tracking-widest text-sm"
              style={{ fontFamily: "Georgia, serif" }}>
              SCAN FOR CALL
            </p>
            <div className="mx-auto mt-1" style={{ height: 2, background: "#fff", width: "80%" }} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 mb-6">
        <Link className="w-5 h-5 text-red-600" />
        <span className="text-lg font-bold text-red-700">{websiteUrl}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-semibold">
          <Download className="w-5 h-5" />
          Download PDF
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold">
          <Share2 className="w-5 h-5" />
          Share QR Code
        </button>
      </div>
    </div>
  );
};

export default QrCode;
