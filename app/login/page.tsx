import Link from 'next/link'

{/* <Link href="/tasks">Go to Tasks</Link> */}

export default function Register() {
  return (
  <div className="bg-[#FBF5D1] px-20 pt-8 pb-15 w-3/5 border-5 border-[#E4DCAB] rounded-3xl justify-items-center translate-x-70 translate-y-15 shadow-xl/40">
    <h2 className="text-[#2E2805] text-3xl">CREATE ACCOUNT</h2>

    <div className="mt-4 gap-x-3 justify-items-center">
            <svg viewBox="0 0 24 24" fill="currentColor" data-slot="icon" aria-hidden="true" className="size-30 text-gray-500">
              <path d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" fill-rule="evenodd" />
            </svg>
            <button type="button" className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-[#2E2805] inset-ring inset-ring-white/5 hover:bg-white/20">upload photo</button>
      </div>
      
      {/* name text area */}
    <div className="flex place-content-between w-1/1 py-4">
  <label htmlFor="name" className="block text-md/6 font-medium text-[#2E2805] basis-1/3">NAME</label>    
   <div className="rounded-t-md bg-white opacity-70 px-3 py-1 basis-2/3 border-b-3 border-[#CCC38D] focus-within:border-[#F0B6CF]">
              <input id="name" type="text" name="name" placeholder="name" className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-[#2E2805] placeholder:text-[#CCC38D] focus:outline-none sm:text-sm/6" />
          </div></div>
   {/* username text area */}
    <div className="flex place-content-between w-1/1 py-4">
      <label htmlFor="username" className="block text-md/6 font-medium text-[#2E2805] basis-1/3">USERNAME</label>    
        <div className="rounded-t-md bg-white opacity-70 px-3 py-1 basis-2/3 border-b-3 border-[#CCC38D] focus-within:border-[#F0B6CF]">
              <input id="username" type="text" name="username" placeholder="username" className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-[#2E2805] placeholder:text-[#CCC38D] focus:outline-none sm:text-sm/6" />
          </div>
    </div>
    {/* e-mail text area */}
    <div className="flex place-content-between w-1/1 py-4">
      <label htmlFor="e-mail" className="block text-md/6 font-medium text-[#2E2805] basis-1/3">E-MAIL</label>    
        <div className="rounded-t-md bg-white opacity-70 px-3 py-1 basis-2/3 border-b-3 border-[#CCC38D] focus-within:border-[#F0B6CF]">
              <input id="e-mail" type="text" name="e-mail" placeholder="e-mail" className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-[#2E2805] placeholder:text-[#CCC38D] focus:outline-none sm:text-sm/6" />
          </div>
    </div>
    {/* password text area */}
    <div className="flex place-content-between w-1/1 py-4">
      <label htmlFor="password" className="block text-md/6 font-medium text-[#2E2805] basis-1/3">PASSWORD</label>    
        <div className="rounded-t-md bg-white opacity-70 px-3 py-1 basis-2/3 border-b-3 border-[#CCC38D] focus-within:border-[#F0B6CF]">
              <input id="password" type="text" name="password" placeholder="password" className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-[#2E2805] placeholder:text-[#CCC38D] focus:outline-none sm:text-sm/6" />
          </div>
    </div>
    {/* buttons */}
    <div className="flex p-4 gap-20">
        <button type="submit" className="rounded-xl bg-[#ADD3EA] px-15 py-2 text-sm font-semibold text-[#524601] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">SIGN UP</button>
       <button type="button" className="rounded-xl text-sm/6 bg-[#F0B6CF] px-15 py-2 font-semibold text-[#524601]">LOG IN</button>
    </div>
</div>
  );
}
