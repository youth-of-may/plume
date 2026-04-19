'use client'

import { deleteEntry } from "./server";

export default function DeleteButton({ id }: { id: string }) {
  return (
    <button onClick={() => deleteEntry(id)} className="bg-[#ADD3EA] py-1 px-3 rounded-2xl text-sm border-3 border-[#5e94b67d] z-999 hover:bg-blue-200">
      Delete
    </button>
  );
}