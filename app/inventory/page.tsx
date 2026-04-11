import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import BodyBackground from "./body_background";
import PetCustomizerClient from "./client.tsx";

type SlotName = "head" | "chest";

async function getPetCustomizationData() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: userPet, error: petError } = await supabase
    .from("user_pet")
    .select(`
      virtual_petid,
      pet_name,
      pet:pet_id (
        pet_id,
        pet_type,
        pet_model
      )
    `)
    .eq("user_id", user.id)
    .single();

  if (petError || !userPet) {
    console.error("user_pet error:", petError?.message);
    return {
      userId: user.id,
      pet: null,
      ownedAccessories: [],
      equippedAccessories: [],
      slots: [],
    };
  }

  const { data: slots, error: slotsError } = await supabase
    .from("slot")
    .select("slot_name, x, y");

  if (slotsError) {
    console.error("slot error:", slotsError.message);
  }

  const { data: ownedAccessoriesRaw, error: ownedError } = await supabase
    .from("accessory_owned")
    .select(`
      accessory_owned_id,
      accessory:accessory_id (
        accessory_id,
        accessory_name,
        accessory_url,
        accessory_type,
        accessory_description
      )
    `)
    .eq("user_id", user.id);

  if (ownedError) {
    console.error("owned accessories error:", ownedError.message);
  }

  const ownedAccessories =
    ownedAccessoriesRaw
      ?.filter((row: any) => row.accessory)
      .map((row: any) => ({
        accessory_owned_id: row.accessory_owned_id,
        accessory_id: row.accessory.accessory_id,
        accessory_name: row.accessory.accessory_name,
        accessory_url: row.accessory.accessory_url,
        accessory_type: row.accessory.accessory_type as SlotName,
        accessory_description: row.accessory.accessory_description,
      }))
      .filter(
        (item: any) =>
          item.accessory_type === "head" || item.accessory_type === "chest"
      ) ?? [];

  const { data: equippedRaw, error: equippedError } = await supabase
    .from("pet_accessory_equipped")
    .select(`
      equipped_id,
      accessory_owned_id,
      accessory_owned:accessory_owned_id (
        accessory:accessory_id (
          accessory_id,
          accessory_name,
          accessory_url,
          accessory_type
        )
      )
    `)
    .eq("virtual_petid", userPet.virtual_petid);

  if (equippedError) {
    console.error("equipped error:", equippedError.message);
  }

  const equippedAccessories =
    equippedRaw
      ?.filter((row: any) => row.accessory_owned?.accessory)
      .map((row: any) => ({
        equipped_id: row.equipped_id,
        accessory_owned_id: row.accessory_owned_id,
        accessory_id: row.accessory_owned.accessory.accessory_id,
        accessory_name: row.accessory_owned.accessory.accessory_name,
        accessory_url: row.accessory_owned.accessory.accessory_url,
        accessory_type: row.accessory_owned.accessory.accessory_type as SlotName,
      })) ?? [];

  return {
    userId: user.id,
    pet: userPet,
    ownedAccessories,
    equippedAccessories,
    slots: slots ?? [],
  };
}

export default async function PetCustomizePage() {
  const data = await getPetCustomizationData();

  if (!data) {
    redirect("/login");
  }

  const { pet, ownedAccessories, equippedAccessories, slots } = data;

  if (!pet || !pet.pet) {
    return (
      <>
        <BodyBackground style="repeating-linear-gradient(90deg, #c08350 0px, #c08350 40px, #f0c09a 40px, #f0c09a 80px)" />
        <div className="min-h-screen p-8">
          <h1 className="text-4xl font-cherry text-[#163F55]">Pet Customization</h1>
          <p className="mt-4 text-lg">No pet found for this user.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <BodyBackground style="repeating-linear-gradient(90deg, #c08350 0px, #c08350 40px, #f0c09a 40px, #f0c09a 80px)" />

      <header className="w-full bg-[#FBF5D1] px-[50px] py-[20px]">
        <h2 className="text-right text-[#163F55] text-5xl font-cherry">
          Pet Customization
        </h2>
      </header>

      <div className="min-h-screen p-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border-4 border-[#FBF5D1] bg-[#eecc8e] p-6 inset-ring-4 inset-ring-[#FBF5D1]">
            <h1 className="text-4xl font-cherry text-[#163F55]">
              {pet.pet_name}
            </h1>
            <p className="mb-6 text-lg text-[#163F55]">{pet.pet.pet_type}</p>

            <PetCustomizerClient
              virtualPetId={pet.virtual_petid}
              petModel={pet.pet.pet_model}
              initialOwnedAccessories={ownedAccessories}
              initialEquippedAccessories={equippedAccessories}
              slots={slots}
            />
          </div>

          <div className="rounded-3xl border-4 border-[#FBF5D1] bg-[#eecc8e] p-6 inset-ring-4 inset-ring-[#FBF5D1]">
            <h2 className="mb-4 text-3xl font-cherry text-[#163F55]">
              Your Accessories
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {ownedAccessories.map((acc: any) => (
                <div
                  key={acc.accessory_owned_id}
                  className="rounded-2xl bg-[#FBF5D1] p-4 text-center shadow"
                >
                  <h3 className="mb-2 text-lg font-semibold text-[#163F55]">
                    {acc.accessory_name}
                  </h3>
                  <Image
                    src={acc.accessory_url}
                    alt={acc.accessory_name}
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                  <p className="mt-2 text-sm uppercase text-[#163F55]">
                    {acc.accessory_type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}