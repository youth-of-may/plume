import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import BodyBackground from "./body_background";

export default async function Inventory() {
  const accessories = await getUserAccessories();

  const divideIntoRows = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const rows = divideIntoRows(accessories, 4);

  const rarity: Record<string, { bg: string; text: string }> = {
    Common:   { bg: "bg-[#D0E8F7]", text: "text-[#163F55]" },
    Rare:     { bg: "bg-[#FFEDF5]", text: "text-[#E37FAA]" },
    Epic:     { bg: "bg-yellow-200", text: "text-yellow-800" },
  };

  return (
  <>
    <BodyBackground style="repeating-linear-gradient(90deg, #c08350 0px, #c08350 40px, #f0c09a 40px, #f0c09a 80px)" />

    <header className="w-full bg-[#FBF5D1] px-12 py-10">
      <h2 className="text-right text-[#2E2805] text-5xl font-cherry">
        Inventory
      </h2>
    </header>

    <div className="flex flex-col py-1 inset-ring-4 inset-ring-[#FBF5D1] font-delius w-full border-b-180 border-[#FBF5D1]">
      {rows.map((group, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4">
          {group.map((acc) => (
            <div
              key={acc.accessory_id}
              className={` pt-4 px-4 mt-5 rounded-t-xl border-x-4 border-t-4 border-[#FBF5D1] h-40 w-40 justify-self-center
                ${rarity[acc.accessory_rarity]?.bg} 
                  ${rarity[acc.accessory_rarity]?.text}`}
            >
              <h1 className="font-black text-center h-10">
                {acc.accessory_name}
              </h1>

              <Image
                src={acc.accessory_url}
                alt={acc.accessory_name}
                width={80}
                height={80}
                className="place-self-center h-20 w-20"
              />

              <ModalWithTrigger acc={acc} />
            </div>
          ))}

          {rowIndex < rows.length - 1 && (
            <>
              <div className="col-span-4 border-b-100 border-[#EFE8C1]" />
              <div className="col-span-4 border-b-50 border-[#FBF5D1]" />
            </>
          )}
        </div>
      ))}
    </div>
  </>
  )}
