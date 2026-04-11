import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import JournalForm from "./journal_form";

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
    <div className="flex flex-col items-end -translate-y-279 -translate-x-60">
        <Image src={character.pet.pet_model} alt={character.pet.pet_type} width={220} height={220} />
    </div>
  );
}


export default function NewJournalPage() {
  const character = getCharacterSummary();
  async function createJournal(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const entry_title = formData.get("entry_title") as string;
    const entry_text = formData.get("entry_text") as string;
    const mood_id = Number(formData.get("mood_id"));

    let image_url: string | null = null;
    const image = formData.get("image") as File | null;
    if (image && image.size > 0) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("journal-images")
        .upload(fileName, image, { contentType: image.type });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("journal-images")
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    const { error } = await supabase
      .from("journal_entry")
      .insert({ entry_title, entry_text, mood_id, image_url });

    if (error) throw new Error(error.message);
    redirect("/journal");
  }

  return <div>
    <JournalForm createJournal={createJournal} />
    <CharacterPanel getCharacter={character}/>
    </div>;
}
