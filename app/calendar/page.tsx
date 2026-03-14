"use client";

import { useState } from "react";
import {
    startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, format, addMonths, isSameDay, isSameMonth,
} from "date-fns";
import CustomSelect from "./select";

type Event = {
    id: string;
    name: string;
    date: Date;
    time: string;
    category: string;
    notes: string;
};

const CATEGORIES = ["Work", "Personal", "School", "Health", "Other"];

export default function KawaiiCalendar() {
    const [current, setCurrent] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [modal, setModal] = useState<{ open: boolean; date: Date | null }>({ open: false, date: null });
    const [form, setForm] = useState({ name: "", time: "12:00", category: "Work", notes: "" });

    const gridStart = startOfWeek(startOfMonth(current));
    const gridEnd = endOfWeek(endOfMonth(current));
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

    const openModal = (date: Date) => {
        setModal({ open: true, date });
        setForm({ name: "", time: "12:00", category: "Work", notes: "" });
    };

    const saveEvent = () => {
        if (!form.name || !modal.date) return;
        setEvents(prev => [...prev, {
            id: crypto.randomUUID(),
            name: form.name,
            date: modal.date!,
            time: form.time,
            category: form.category,
            notes: form.notes,
        }]);
        setModal({ open: false, date: null });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-pink-200 p-6">
            <div className="rounded-3xl w-full max-w-4xl shadow-md shadow-black/20 overflow-hidden font-delius">
                <div className="bg-[#CCC38D]">

                    {/* Header */}
                    <div className="flex flex-row items-center px-6 py-6">
                        <div className="flex-1" />
                        <div className="flex flex-row gap-x-8 text-lg">
                            <CustomSelect
                                value={format(current, "MMMM")}
                                options={Array.from({ length: 12 }, (_, i) => format(new Date(2000, i), "MMMM"))}
                                onChange={val => {
                                    const m = new Date(current);
                                    m.setMonth(new Date(`${val} 1`).getMonth());
                                    setCurrent(m);
                                }}
                            />
                            <CustomSelect
                                value={format(current, "yyyy")}
                                options={["2024", "2025", "2026", "2027"]}
                                onChange={val => {
                                    const d = new Date(current);
                                    d.setFullYear(+val);
                                    setCurrent(d);
                                }}
                            />
                        </div>
                        <div className="flex-1 flex justify-end">
                            <button
                                onClick={() => setCurrent(addMonths(current, 1))}
                                className="bg-transparent border-2 border-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-white hover:bg-[#92cbee] transition-colors"
                            >→</button>
                        </div>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 bg-[#ADD3EA] text-center text-sm font-bold text-blue-700 py-5 px-6">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                            <div key={d}>{d}</div>
                        ))}
                    </div>

                    {/* Grid + cat wrapper */}
                    <div className="relative bg-[#FBF5D1]">
                        <div className="grid grid-cols-7 place-items-center px-6 gap-y-2 py-8">
                            {days.map(day => {
                                const isToday = isSameDay(day, new Date());
                                const inMonth = isSameMonth(day, current);
                                const dayEvents = events.filter(e => isSameDay(e.date, day));
                                return (
                                    <div
                                        key={day.toISOString()}
                                        onClick={() => openModal(day)}
                                        className={`flex flex-col items-center justify-start
                                            w-full min-h-[72px] p-1 cursor-pointer transition-colors
                                            ${inMonth ? "opacity-100" : "opacity-40"}`}
                                    >
                                        <div className={`text-xl font-bold flex justify-center items-center
                                            w-12 h-12 rounded-2xl transition-colors
                                            ${isToday
                                                ? "bg-blue-200 text-[#163F55] shadow-md shadow-blue-950/10"
                                                : "text-[#163F55] hover:bg-yellow-200"
                                            }`}
                                        >
                                            {format(day, "d")}
                                        </div>
                                        {dayEvents.slice(0, 2).map(ev => (
                                            <div key={ev.id} className="mt-0.5 text-[10px] bg-pink-300
                                                text-pink-900 rounded px-1 truncate w-full text-center">
                                                {ev.name}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cat — bottom right */}
                        <div className="absolute bottom-0 right-4 z-10">
                            <img
                                src="/animal_placeholder.png"
                                className="w-32 h-32 object-contain"
                            />
                        </div>

                    </div>

                </div>

                {/* Modal */}
                {modal.open && (
                    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                        <div className="bg-[#FFEDF5] outline-4 outline-[#F0B6CF] rounded-3xl p-12 w-md shadow-2xl space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Event Name*</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Input name"
                                    className="w-full border-b border-[#F0B6CF] bg-transparent text-sm py-1 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Date*</label>
                                <div className="text-sm text-gray-600 border-b border-[#F0B6CF] py-1">
                                    {modal.date ? format(modal.date, "EEEE, MMMM d") : ""}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Duration</label>
                                <br />
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                    className="text-sm border-b border-[#F0B6CF] bg-transparent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Category</label>
                                <br />
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="mt-1 text-sm bg-white border-b border-[#F0B6CF] rounded-lg px-2 py-0.5 focus:outline-none"
                                >
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Notes</label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Input notes"
                                    className="w-full border-b border-[#F0B6CF] bg-transparent text-sm px-2 py-2 focus:outline-none resize-none"
                                    rows={5}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={saveEvent}
                                    className="flex-1 bg-[#ADD3EA] hover:bg-[#92cbee] text-[#163F55] font-bold py-1.5 rounded-full text-sm transition-colors"
                                >
                                    save
                                </button>
                                <button
                                    onClick={() => setModal({ open: false, date: null })}
                                    className="flex-1 bg-[#ADD3EA] hover:bg-[#92cbee] text-[#163F55] font-bold py-1.5 rounded-full text-sm transition-colors"
                                >
                                    cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}