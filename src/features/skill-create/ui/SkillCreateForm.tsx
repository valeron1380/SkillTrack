import { useState, type FormEvent } from "react";

type SkillCreateFormProps = {
  onCreate: (payload: {
    title: string;
    category: string;
    currentLevel: number;
    targetLevel: number;
    weeklyMinutesGoal: number;
  }) => Promise<void>;
};

const fieldClass =
  "w-full border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15";
const labelClass = "grid gap-2 text-sm font-bold text-slate-700";

export const SkillCreateForm = ({ onCreate }: SkillCreateFormProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Frontend");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(6);
  const [weeklyMinutesGoal, setWeeklyMinutesGoal] = useState(180);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (title.trim().length < 2) {
      setError("Название навыка должно быть не короче 2 символов.");
      return;
    }
    if (targetLevel < currentLevel) {
      setError("Целевой уровень не должен быть ниже текущего.");
      return;
    }

    await onCreate({ title, category, currentLevel, targetLevel, weeklyMinutesGoal });
    setTitle("");
    setCurrentLevel(1);
    setTargetLevel(6);
  };

  return (
    <form className="grid gap-4 border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]" onSubmit={submit}>
      <div>
        <span className="text-xs font-black uppercase text-slate-500">новый навык</span>
        <h2 className="text-2xl font-black text-slate-950">Добавить цель развития</h2>
      </div>
      <label className={labelClass}>
        Название
        <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="React Router, SQL, Docker" />
      </label>
      <label className={labelClass}>
        Категория
        <select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)}>
          <option>Frontend</option>
          <option>Backend</option>
          <option>Database</option>
          <option>Testing</option>
          <option>Soft skills</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Сейчас
          <input className={fieldClass} type="number" min={1} max={10} value={currentLevel} onChange={(event) => setCurrentLevel(Number(event.target.value))} />
        </label>
        <label className={labelClass}>
          Цель
          <input className={fieldClass} type="number" min={1} max={10} value={targetLevel} onChange={(event) => setTargetLevel(Number(event.target.value))} />
        </label>
      </div>
      <label className={labelClass}>
        Минут в неделю
        <input
          className={fieldClass}
          type="number"
          min={30}
          max={2400}
          step={30}
          value={weeklyMinutesGoal}
          onChange={(event) => setWeeklyMinutesGoal(Number(event.target.value))}
        />
      </label>
      {error && <div className="border border-red-200 bg-red-50 p-3 font-bold text-red-700">{error}</div>}
      <button className="bg-teal-800 px-4 py-3 font-black text-white transition hover:bg-teal-900">Добавить навык</button>
    </form>
  );
};
