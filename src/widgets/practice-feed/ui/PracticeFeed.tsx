import type { PracticeLog } from "../../../entities/practice/model/types";
import type { Skill } from "../../../entities/skill/model/types";
import { formatDate, minutesLabel } from "../../../shared/lib/date";

type PracticeFeedProps = {
  logs: PracticeLog[];
  skills: Skill[];
};

export const PracticeFeed = ({ logs, skills }: PracticeFeedProps) => {
  const skillById = new Map(skills.map((skill) => [skill.id, skill]));

  return (
    <section className="border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]">
      <div className="mb-5">
        <span className="text-xs font-black uppercase text-slate-500">активность</span>
        <h2 className="text-2xl font-black text-slate-950">Журнал практики</h2>
      </div>
      <div className="grid gap-3">
        {logs.length === 0 && <p className="text-slate-500">Записей практики пока нет.</p>}
        {logs.slice(0, 8).map((log) => (
          <article className="flex justify-between gap-4 border-t border-slate-200 py-4" key={log.id}>
            <div>
              <strong>{skillById.get(log.skillId)?.title ?? "Навык"}</strong>
              <p className="mt-1 text-slate-500">{log.note}</p>
            </div>
            <span className="shrink-0 font-black text-slate-600">
              {minutesLabel(log.minutes)} · {formatDate(log.practicedAt)}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
};
