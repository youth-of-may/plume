"use client";

import { useState } from "react";
import Image from "next/image";

type Accessory = {
  accessory_id: string;
  accessory_name: string;
  accessory_rarity: string;
  accessory_type: string;
  accessory_description: string;
  accessory_exp: number;
  accessory_url: string;
};

export default function ModalWithTrigger({ acc }: { acc: Accessory }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(30, 18, 5, 0.72)", backdropFilter: "blur(4px)" }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Panel */}
          <div
            className="relative z-10 w-[90vw] max-w-2xl rounded-3xl p-8 shadow-2xl"
            style={{
              backgroundColor: "#FBF5D1",
              border: "4px solid #c08350",
              animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1) both",
            }}
          >
            {/* Decorative corner dots */}
            <span className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#c08350] opacity-60" />
            <span className="absolute top-4 right-12 w-3 h-3 rounded-full bg-[#c08350] opacity-60" />
            <span className="absolute bottom-4 left-12 w-3 h-3 rounded-full bg-[#c08350] opacity-60" />
            <span className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#c08350] opacity-60" />

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors"
              style={{ backgroundColor: "#c08350", color: "#FBF5D1" }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = "#8b5c30")}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = "#c08350")}
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div
                className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3"
                style={{ backgroundColor: "#ADD3EA", color: "#1a3e8c", border: "2px solid #4a80e0" }}
              >
                Rare
              </div>
              <h2
                className="text-3xl font-black text-[#2E2805] leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Inventory Item
              </h2>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-[#c08350] mb-6" />

            {/* Content area */}
            <div className="flex gap-6 items-start">
              {/* Image placeholder */}
              <div
                className="shrink-0 w-32 h-32 rounded-2xl flex items-center justify-center text-4xl"
                style={{ backgroundColor: "#ADD3EA", border: "4px solid #c08350" }}
              >
                <Image src={acc.accessory_url} alt={acc.accessory_name} width={80} height={80} className="place-self-center"
                />
            </div>

              {/* Details */}
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#c08350] mb-1">Description</p>
                  <p className="text-sm text-[#3b3210] leading-relaxed">
                    {acc.accessory_description}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <div
                    className="px-4 py-2 rounded-xl text-sm font-black"
                    style={{ backgroundColor: "#e8dfc0", border: "2px solid #c08350", color: "#5a4a10" }}
                  >
                    Type: {acc.accessory_type}
                  </div>
                  <div
                    className="px-4 py-2 rounded-xl text-sm font-black flex items-center gap-1"
                    style={{ backgroundColor: "#ADD3EA", border: "2px solid #4a80e0", color: "#1a3e8c" }}
                  >
                    ⭐ {acc.accessory_exp}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-colors"
                style={{ backgroundColor: "#c08350", color: "#FBF5D1", border: "3px solid #8b5c30" }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = "#8b5c30")}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = "#c08350")}
              >
                Close
              </button>
            </div>
          </div>

          <style>{`
            @keyframes popIn {
              from { transform: scale(0.75) translateY(20px); opacity: 0; }
              to   { transform: scale(1)    translateY(0);    opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}