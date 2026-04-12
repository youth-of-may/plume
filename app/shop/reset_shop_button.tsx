"use client";
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function ResetShopButton({ userexp }: { userexp: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const canAfford = userexp >= 1000
  async function resetShop(){
    const supabase = createClient()
    const router = useRouter()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return

    if (canAfford){
      const { data: profileRows } = await supabase
        .from("profile")
        .select("exp_amount")
        .eq("user_id", user.id)

      const currentExp = Number(profileRows?.[0]?.exp_amount ?? 0)

      // deduct exp
      const newExp = currentExp - 1000
      const profileUpdate = await supabase
        .from("profile")
        .update({ exp_amount: newExp })
        .eq("user_id", user.id)   

      if(profileUpdate.error){
        return
      }
  }
}

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border-4 border-[#D7B87F] bg-[#FBF5D1] px-6 py-3 font-delius text-lg font-bold text-[#2E2805] shadow-md transition-transform hover:scale-[1.02] whitespace-nowrap"
      >
        Reset Shop - 1000 EXP
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative z-10 w-[90vw] max-w-md rounded-3xl border-4 border-[#D7B87F] bg-[#FBF5D1] p-7 shadow-2xl">
            <h3 className="text-center font-cherry text-3xl text-[#2E2805]">
              Reset Shop?
            </h3>

            <p className="mt-4 text-center font-delius text-lg leading-snug text-[#2E2805]">
              This will reroll today&apos;s shop for <span className="font-bold">1000 EXP</span>.
            </p>

            <p className="mt-4 text-center font-delius text-lg leading-snug text-[#2E2805]">
              Refreshing or leaving the page will reset this.
            </p>

            <p className="mt-2 text-center font-delius text-base text-[#6B5622]">
              Current EXP: {userexp}
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-2xl border-4 border-[#D7B87F] bg-white px-5 py-2 font-delius font-bold text-[#2E2805] shadow-sm"
              >
                Cancel
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-2xl border-4 border-[#D7B87F] bg-[#F5E8A0] px-5 py-2 font-delius font-bold text-[#2E2805] shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
