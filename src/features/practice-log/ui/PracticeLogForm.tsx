import { useState, type FormEvent } from "react";
import { todayIso } from "../../../shared/lib/date";

type PracticeLogFormProps = {
  onAdd: (minutes: number, note: string, practicedAt: string) => Promise<void>;
};

const fieldClass =
  "w-full border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15";
const labelClass = "grid gap-2 text-sm font-bold text-slate-700";

export const PracticeLogForm = ({ onAdd }: PracticeLogFormProps) => {
  const [minutes, setMinutes] = useState(45);
  const [note, setNote] = useState("");
  const [practicedAt, setPracticedAt] = useState(todayIso());
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (minutes < 5) {
      setError("Минимальная запись практики - 5 минут.");
      return;
    }
    if (note.trim().length < 3) {
      setError("Опишите, что именно делали.");
      return;
    }
    if (practicedAt > todayIso()) {
      setError("Нельзя добавить практику на будущую дату.");
      return;
    }

    await onAdd(minutes, note, practicedAt);
    setNote("");
    setMinutes(45);
  };

  return (
    <form className="grid gap-4 border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]" onSubmit={submit}>
      <div>
        <span className="text-xs font-black uppercase text-slate-500">журнал</span>
        <h2 className="text-2xl font-black text-slate-950">Записать практику</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClass}>
          Минуты
          <input className={fieldClass} type="number" min={5} max={720} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))} />
        </label>
        <label className={labelClass}>
          Дата
          <input className={fieldClass} type="date" value={practicedAt} max={todayIso()} onChange={(event) => setPracticedAt(event.target.value)} />
        </label>
      </div>
      <label className={labelClass}>
        Что сделано
        <textarea
          className={`${fieldClass} min-h-28 resize-y`}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Например: разобрал nested routes и protected routes"
        />
      </label>
      {error && <div className="border border-red-200 bg-red-50 p-3 font-bold text-red-700">{error}</div>}
      <button className="bg-teal-800 px-4 py-3 font-black text-white transition hover:bg-teal-900">Сохранить запись</button>
    </form>
  );
};
