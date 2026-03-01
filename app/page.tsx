import Link from 'next/link'

<Link href="/tasks">Go to Tasks</Link>

export default function Page() {
  return <div><u><Link href="/tasks">Go to Tasks</Link></u></div>
}