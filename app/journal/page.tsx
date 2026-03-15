import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import JournalForm from "./journal_form";

export default function NewJournalPage() {
  async function createJournal(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("AUTH USER ERROR:", userError?.message);
      throw new Error("No authenticated user found.");
    }

    const { data: profileBySession, error: profileBySessionError } = await supabase
      .from("profile")
      .select("user_id, virtual_petid")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileBySessionError) {
      console.error("PROFILE LOOKUP ERROR:", profileBySessionError.message);
      throw new Error("Unable to resolve profile. Please try again.");
    }

    if (!profileBySession?.user_id) {
      throw new Error(
        "No profile row found for current user. Please sign in again and contact support if this continues."
      );
    }

    const entry_title = formData.get("entry_title") as string;
    const entry_text = formData.get("entry_text") as string;
    const mood_id = Number(formData.get("mood_id"));
    if (!Number.isFinite(mood_id) || mood_id <= 0) {
      throw new Error("Please select a mood before saving.");
    }

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

    if (error) {
      throw new Error(error.message);
    }

    if (!createdEntry?.user_id) {
      throw new Error("Journal entry was saved but user id was not returned.");
    }

    if (createdEntry.user_id !== profileBySession.user_id) {
      throw new Error("Journal owner does not match the current user.");
    }

    if (!profileBySession.virtual_petid) {
      throw new Error("No selected pet linked to this account.");
    }

    const { data: ownedPet, error: petLookupError } = await supabase
      .from("user_pet")
      .select("virtual_petid")
      .eq("virtual_petid", profileBySession.virtual_petid)
      .eq("user_id", createdEntry.user_id)
      .maybeSingle();

    if (petLookupError || !ownedPet?.virtual_petid) {
      throw new Error("No pet row found for this user while updating mood.");
    }

    const { error: moodUpdateError } = await supabase
      .from("user_pet")
      .update({ mood_id })
      .eq("virtual_petid", ownedPet.virtual_petid);

    if (moodUpdateError) {
      throw new Error(moodUpdateError.message);
    }

    redirect("/journal");
  }

  return <JournalForm createJournal={createJournal} />;
}
