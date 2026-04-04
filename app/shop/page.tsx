import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import BodyBackground from "./body_background";

type PetData = {
  pet_model: string;
  pet_type: string;
} | null;

type CharacterData = {
  userName: string;
  petName: string;
  expAmount: number;
  pet: PetData;
};

type CharacterResult =
  | { kind: "notFound" }
  | { kind: "notSelected" }
  | { kind: "ready"; data: CharacterData };

export async function getAccessories() {

  'use server'

  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data: accessories, error } = await supabase
    .from("accessory")
    .select("*");

  if (error) {
    console.error(error.message);
    return [];
  }

  return accessories;
}

async function getCharacterSummary(): Promise<CharacterResult> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { kind: "notFound" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("user_id, username, virtual_petid, exp_amount")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { kind: "notFound" };
  }

  if (!profile.virtual_petid) {
    return { kind: "notSelected" };
  }

  const { data: userPet, error: userPetError } = await supabase
    .from("user_pet")
    .select("pet_name, mood_id, pet_id")
    .eq("virtual_petid", profile.virtual_petid)
    .maybeSingle();

  if (userPetError || !userPet) {
    return { kind: "notFound" };
  }

  const { data: pet } = await supabase
    .from("pet")
    .select("pet_model, pet_type")
    .eq("pet_id", userPet.pet_id)
    .maybeSingle();


  return {
    kind: "ready",
    data: {
      userName: profile.username,
      expAmount: profile.exp_amount ?? 0,
      petName: userPet.pet_name || "My Pet",
      pet,
    },
  };
}


async function CharacterPanel({
  getCharacter,
}: {
  getCharacter: Promise<CharacterResult>;
}) {
  const data = await getCharacter;

  if (data.kind === "notFound") {
    return (
      <div className="rounded-2xl border-4 border-[#E4DCAB] p-6 bg-[#fef5ffbb]">
        <p className="font-delius text-lg text-[#2E2805]">Please log in to see your character.</p>
      </div>
    );
  }

  if (data.kind === "notSelected") {
    return (
      <div className="rounded-2xl border-4 border-[#E4DCAB] p-6 bg-[#fef5ffbb]">
        <p className="font-delius text-lg text-[#2E2805] mb-3">
          You have not selected a pet yet.
        </p>
        <Link href="/pet-selection" className="font-delius underline text-[#C17F9E]">
          Choose your pet now
        </Link>
      </div>
    );
  }

  const character = data.data;
  if (!character.pet) {
    return (
      <div className="rounded-2xl border-4 border-[#E4DCAB] p-6 bg-[#fef5ffbb]">
        <p className="font-delius text-lg text-[#2E2805]">Pet image unavailable. Please select a pet again.</p>
        <Link href="/pet-selection" className="font-delius underline text-[#C17F9E]">Re-select pet</Link>
      </div>
    );
  }

  return (
    <div className="p-6 bg-linear-to-b to-[#EF87BE] from-[#FFCEE6] flex flex-col col-span-2 ms-20 items-center h-52 translate-y-1 shadow-lg border-5 border-[#F0B6CF]">
        <Image src={character.pet.pet_model} alt={character.pet.pet_type} width={200} height={200} className="-translate-y-6.5" />
    </div>
  );
}

async function UserEXP({
  getCharacter,
}: {
  getCharacter: Promise<CharacterResult>;
}) {
  const data = await getCharacter;

  if (data.kind === "notFound") {
    return (
      <div className="rounded-2xl border-4 border-[#E4DCAB] p-6 bg-[#fef5ffbb]">
        <p className="font-delius text-lg text-[#2E2805]">Please log in to see your pet.</p>
      </div>
    );
  }

  if (data.kind === "notSelected") {
    return (
      <div className="rounded-2xl border-4 border-[#E4DCAB] p-6 bg-[#fef5ffbb]">
        <p className="font-delius text-lg text-[#2E2805] mb-3">
          You have not selected a pet yet.
        </p>
        <Link href="/pet-selection" className="font-delius underline text-[#C17F9E]">
          Choose your pet now
        </Link>
      </div>
    );
  }

  const character = data.data;

  if (!character.pet) {
    return (
      <div className="rounded-2xl border-4 border-[#E4DCAB] p-6 bg-[#fef5ffbb]">
        <p className="font-delius text-lg text-[#2E2805]">Pet image unavailable. Please select a pet again.</p>
        <Link href="/pet-selection" className="font-delius underline text-[#C17F9E]">Re-select pet</Link>
      </div>
    );
  }

  return (
    <div>
      <p className="font-delius text-2xl font-bold text-[#2E2805]">
        {character.expAmount} EXP
      </p>
    </div>
  );
}


export default async function Shop() {
  const accessories = await getAccessories();
  const character = getCharacterSummary();
  return (
    <>
       <BodyBackground style="repeating-linear-gradient(90deg, #c08350 0px, #c08350 40px, #f0c09a 40px, #f0c09a 80px)" />

      <header className="flex w-full justify-between bg-[#FBF5D1] py-5 px-15">
        <div className="flex justify-center items-center bg-[#F5E8A0] border-4 border-[#D7B87F] rounded-2xl w-45 h-15 self-center">
          <h2 className="text-right text-[#2E2805] text-5xl font-cherry">
          <UserEXP getCharacter={character}/>
        </h2>
        </div>
        <div className="flex justify-center place-items-center bg-[#F5E8A0] border-4 border-[#D7B87F] rounded-2xl w-55 px-20 py-5 me-15 translate-y-12 z-25 justify-self-end">
          <h2 className="text-right text-[#2E2805] text-6xl font-cherry">
          SHOP
        </h2>
        </div>
      </header>

      <div className="grid grid-cols-4 inset-ring-4 inset-ring-[#FBF5D1] font-delius w-full border-b-180 border-[#FBF5D1] text-[#2E2805]">
          {accessories?.map((acc, index) => (
            <>
            <div className="flex flex-col gap-10 translate-y-14 items-center justify0center">
              <div className="bg-[#ADD3EA] pt-4 px-4 rounded-t-xl border-t-4 border-x-4 border-[#FBF5D1] w-40 h-35 translate-y-4">
                <h1 className="font-black text-center">{acc.accessory_name}</h1>
                <Image
                  src={acc.accessory_url}
                  alt={acc.accessory_name}
                  width={80}
                  height={80}
                  className="place-self-center"
                />
                {/* price */}
              </div>
              <div className="z-15 bg-[#FBF5D1] px-5 border-4 border-white rounded-2xl shadow-md">
                  <h4 className="font-bold">{ acc.accessory_exp }</h4>
                </div>
              </div>
            {index === 1 && (
            <>
            <CharacterPanel getCharacter={character}/>
            </>
          )}
          {index % 4 === 1 && (
            <>
            <div className="col-span-4 border-b-70 border-[#EFE8C1] shadow-md"></div>
            <div className="col-span-4 border-b-50 border-[#FBF5D1]"></div>
            </>
          )}
            </>
          ))}
          <div className="col-span-4 border-b-70 border-[#EFE8C1]"></div>
            <div className="col-span-4 border-b-50 border-[#FBF5D1]"></div>
        </div>  
    </>
  );
}
