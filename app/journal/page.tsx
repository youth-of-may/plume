import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'


export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  return (
    <div className='m-12 ml-32 flex flex-col gap-8'>
      
    </div>
  )
}
