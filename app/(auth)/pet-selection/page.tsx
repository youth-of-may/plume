import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { cookies } from "next/headers";

export async function getPetImages(){
    'use server'

    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
    console.log("No user logged in");
    return;
    }
    
    console.log(user.id)

    const { data: pets, error: notFound } = await supabase
        .from("pet")
        .select("*")

    if (notFound) {
        console.error(notFound.message);
        return;
        }
        console.log(pets)

    return pets;
    }


export default async function petselection(){
    const pets = await getPetImages();

    return (
    <div className={"bg-[#FBF5D1] border-5 border-[#E4DCAB] grid grid-template-rows-2 h-150 w-250 pt-10 px-10 pb-20 rounded-4xl justify-items-center translate-x-10 translate-y-15 shadow-xl/40 overflow-hidden"}>
            <h1 className="font-cherry text-[#2E2805] text-6xl pb-10">CHOOSE YOUR PET</h1>
            <div className="flex gap-15 justify-center bg-[#fef5ffbb] py-6 rounded-4xl shadow-lg">
                {pets?.map((pet) => (
                    <div key={pet.pet_id} className="grid grid-template-rows-2 place-items-center gap-8">
                        <Image src={pet.pet_model} width={500} height={500} alt={pet.pet_type} /><h3 className="font-delius text-3xl">{pet.pet_type}</h3>
                    </div>
                ))}
        </div>
        </div>
    );
}