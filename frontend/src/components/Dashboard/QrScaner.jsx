import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ScanLine, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QrScanner = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!scannerOpen) return;

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrCode.stop().catch(() => {}); // ignore stop errors here

          setScannerOpen(false);

          window.location.href = decodedText;
        },
        (errorMessage) => {
          console.warn(errorMessage);
        },
      )
      .catch((err) => console.error(err));

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.getState() === 2) {
        // 2 = SCANNING state
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, [scannerOpen, navigate]);

  const closeScanner = async () => {
    if (html5QrCodeRef.current) {
      const state = html5QrCodeRef.current.getState();
      if (state === 2) {
        await html5QrCodeRef.current.stop().catch(() => {});
      }
    }
    setScannerOpen(false);
  };

  return (
    <div>
      {!scannerOpen && (
        <ScanLine
          onClick={() => setScannerOpen(true)}
          className="text-white cursor-pointer"
        />
      )}

      {scannerOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={closeScanner}
              className="absolute top-[-40px] right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition">
              <X className="w-5 h-5" />
            </button>

            <div
              id="reader"
              className="w-[300px] h-[300px] bg-white rounded-lg shadow-lg"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
