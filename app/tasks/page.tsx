import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import TaskListClient from "./tasklistclient"


export default async function Page() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: tasks } = await supabase.from('task').select()
    const completedTasks = tasks?.filter(task => task.is_complete)
    const pendingTasks = tasks?.filter(task => !task.is_complete) 

    const expPoints = 0
//   return (
//     <div>
//     <h2>EXP Points: {expPoints}</h2>
//     <br />

//     <h2>Pending Tasks</h2>
//     <TaskListClient pendingTasks={pendingTasks ?? []} />

//     <br />

//     <h2>Completed Tasks</h2>
//     <ul>
//         {completedTasks?.map((task) => (
//         <li key={task.id}>
//             <strong>{task.task_title}</strong>
//             <p>{task.task_details}</p>
//         </li>
//         ))}
//     </ul>
//     </div>
//   )

    return(
        <div>
            <h2>EXP Points: {expPoints}</h2>
            <br />
            <h2>Pending Tasks</h2>        
            <TaskListClient tasks={pendingTasks ?? []} mode="pending" />
            <br />
            <h2>Completed Tasks</h2>
            <TaskListClient tasks={completedTasks ?? []} mode="completed" />
        </div>
    )

}
