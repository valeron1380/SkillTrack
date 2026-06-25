import { useState, type FormEvent } from "react";
import type { SkillGoal } from "../../../entities/skill/model/types";
import { formatDate } from "../../../shared/lib/date";

type GoalListProps = {
  goals: SkillGoal[];
  onCreate: (title: string, dueDate: string) => Promise<void>;
  onToggle: (goal: SkillGoal) => Promise<void>;
};

const inputClass =
  "w-full border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15";

export const GoalList = ({ goals, onCreate, onToggle }: GoalListProps) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim().length < 2) return;
    await onCreate(title, dueDate);
    setTitle("");
    setDueDate("");
  };

  return (
    <section className="border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]">
      <div className="mb-5">
        <span className="text-xs font-black uppercase text-slate-500">этапы</span>
        <h2 className="text-2xl font-black text-slate-950">Цели по навыку</h2>
      </div>
      <form className="mb-4 grid gap-3 lg:grid-cols-[1fr_150px_120px]" onSubmit={submit}>
        <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Например: собрать CRUD на Supabase" />
        <input className={inputClass} type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <button className="bg-slate-950 px-4 py-3 font-black text-white transition hover:bg-slate-800">Добавить</button>
      </form>
      <div className="grid gap-3">
        {goals.length === 0 && <p className="text-slate-500">Цели пока не добавлены.</p>}
        {goals.map((goal) => (
          <button
            className={`flex justify-between gap-3 border p-3 text-left transition ${
              goal.isDone ? "border-lime-300 bg-lime-50 text-lime-950" : "border-slate-300 bg-white hover:border-teal-700"
            }`}
            key={goal.id}
            onClick={() => onToggle(goal)}
          >
            <span>{goal.title}</span>
            <small>{formatDate(goal.dueDate)}</small>
          </button>
        ))}
      </div>
    </section>
  );
};
