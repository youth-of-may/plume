import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { cookies } from "next/headers";

export default async function PetSelection(){
    'use server'

    const supabase = await createClient();
    const { data: bunny } = supabase.storage
        .from('assets')
        .getPublicUrl('pet/Bunny.png')
    const bunnyUrl = bunny.publicUrl

    const { data: hamster } = supabase.storage
        .from('assets')
        .getPublicUrl('pet/Hamster.png')
    const hamsterUrl = hamster.publicUrl

    const { data: cat } = supabase.storage
        .from('assets')
        .getPublicUrl('pet/Cat.png')
    const catUrl = cat.publicUrl

    return (
    <div className={"bg-[#FBF5D1] border-5 border-[#E4DCAB] grid grid-template-rows-2 h-150 w-250 pt-10 px-10 pb-20 rounded-4xl justify-items-center translate-x-10 translate-y-15 shadow-xl/40 overflow-hidden"}>
            <h1 className="font-cherry text-[#2E2805] text-6xl pb-10">CHOOSE YOUR PET</h1>
            <div className="flex gap-15 justify-center">
                {/* <Image 
                    src={hamsterUrl} 
                    alt="Hamster"
                    width={300} 
                    height={300}>
                    </Image>
                 <Image 
                    src={catUrl} 
                    alt="Cat"
                    width={300} 
                    height={300}>     
                    </Image>
                 <Image 
                    src={bunnyUrl} 
                    alt="Bunny"
                    width={300} 
                    height={300}> 
                    </Image> */}
                <div className="grid grid-template-rows-2 place-items-center gap-8">
                    <a><img src="https://picsum.photos/200" alt="Hamster" className="hover:size-60"></img></a>
                    <h3 className="font-delius text-3xl">Hamster</h3>
                    </div>
                <div className="grid grid-template-rows-2 place-items-center gap-8">
                    <a><img src="https://picsum.photos/200" alt="Cat" className="hover:size-60"></img></a>
                    <h3 className="font-delius text-3xl">Cat</h3></div>
                <div className="grid grid-template-rows-2 place-items-center gap-8">
                    <a><img src="https://picsum.photos/200" alt="Bunny" className="hover:size-60"></img></a>
                    <h3 className="font-delius text-3xl">Bunny</h3>
                    </div>
            </div>
        </div>
    );
}