import React, { useEffect } from "react";

function OptionCard({
  title,
  desc,
  onClick
}: {
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-xl border bg-white p-4 hover:shadow-soft hover:border-brand-200 transition"
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="text-xs text-slate-600 mt-1">{desc}</div>
    </button>
  );
}

export default function CalculateModal({
  open,
  onClose,
  onPick
}: {
  open: boolean;
  onClose: () => void;
  onPick: (path: string) => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-slate-50 border shadow-soft overflow-hidden">
          <div className="px-5 py-4 bg-white border-b flex items-center justify-between">
            <div>
              <div className="font-semibold">Calculate Your Tax</div>
              <div className="text-xs text-slate-600">
                Select the type of tax you want to calculate
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-slate-100 grid place-items-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="p-5 grid sm:grid-cols-2 gap-3">
            <OptionCard
              title="PAYE / PIT"
              desc="Personal Income Tax calculator"
              onClick={() => onPick("/tax/paye-pit")}
            />
            <OptionCard title="VAT" desc="Value Added Tax calculator" onClick={() => onPick("/tax/vat")} />
            <OptionCard
              title="Freelancer / Self-Employed"
              desc="Tax for freelancers and self-employed individuals"
              onClick={() => onPick("/tax/freelancer")}
            />
            <OptionCard
              title="Company Income Tax"
              desc="Corporate tax calculator"
              onClick={() => onPick("/tax/company")}
            />
          </div>

          <div className="px-5 pb-5 text-xs text-slate-500">
            If you are not logged in, you will be redirected to Sign In.
          </div>
        </div>
      </div>
    </div>
  );
}
