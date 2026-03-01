import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import './globals.css'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: todos } = await supabase.from('todos').select()

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.task}</li>
      ))}
    </ul>
  )
}
