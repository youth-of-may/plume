import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Reset_Password() {
    return (
  <div className={"bg-[#FBF5D1] px-10 pt-20 pb-15 border-5 border-[#E4DCAB] rounded-4xl justify-items-center translate-x-65 translate-y-15 shadow-xl/40"}>
    <h2 className="font-cherry text-[#2E2805] text-5xl pb-10">RESET PASSWORD</h2>

      {/* new password text area */}
    <div className="grid grid-rows-2 w-9/10 py-4 px-10">
        <label htmlFor="new-password" className="self-center block font-delius text-xl/6 font-bold text-[#2E2805] basis-1/3">New Password</label>    
        <div className="rounded-t-md bg-white wopacity-70 px-3 py-1 border-b-3 border-[#CCC38D] focus-within:border-[#F0B6CF]">
            <input id="new-password" type="text" name="new-password" placeholder="type new password" className="font-delius block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-[#2E2805] placeholder:text-[#CCC38D] focus:outline-none sm:text-sm/6" />
        </div>
    </div>
   {/* re-enter password text area */}
    <div className="grid grid-rows-2 w-9/10 py-4 px-10">
        <label htmlFor="reenter-password" className="self-center block font-delius text-xl/6 font-bold text-[#2E2805] basis-1/3">Re-enter Password</label>    
        <div className="rounded-t-md bg-white wopacity-70 px-3 py-1 border-b-3 border-[#CCC38D] focus-within:border-[#F0B6CF]">
            <input id="reenter-password" type="text" name="reenter-password" placeholder="re-enter your password" className="font-delius block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-[#2E2805] placeholder:text-[#CCC38D] focus:outline-none sm:text-sm/6" />
        </div>
    </div>
    
    {/* buttons */}
    <div className="grid grid-rows-2 p-4 gap-2.5">
        <button type="submit" className="font-delius rounded-2xl bg-[#ADD3EA] px-20 py-2 text-sm font-semibold text-[#524601]">Reset Password</button>
       <button type="button" className="font-delius rounded-2xl text-sm/6 bg-[#F0B6CF] px-20 py-2 font-semibold text-[#524601]">Back to Login</button>
    </div>
</div>
  );
}

