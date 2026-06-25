import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSkillTrackContext } from "../../../app/SkillTrackContext";
import { GoalList } from "../../../features/goal-toggle/ui/GoalList";
import { PracticeLogForm } from "../../../features/practice-log/ui/PracticeLogForm";
import type { ReviewStatus, SkillStatus } from "../../../entities/skill/model/types";
import { PracticeFeed } from "../../../widgets/practice-feed/ui/PracticeFeed";
import { minutesLabel } from "../../../shared/lib/date";

const textareaClass =
  "min-h-28 w-full resize-y border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15";

export const SkillDetailsPage = () => {
  const { id = "" } = useParams();
  const {
    skills,
    logs,
    goalsBySkill,
    profile,
    addPracticeLog,
    createGoal,
    toggleGoal,
    updateSkillStatus,
    updateReview,
  } = useSkillTrackContext();
  const [mentorNote, setMentorNote] = useState("");

  const skill = skills.find((item) => item.id === id);
  const skillLogs = logs.filter((log) => log.skillId === id);
  const goals = goalsBySkill[id] ?? [];
  const totalMinutes = skillLogs.reduce((sum, log) => sum + log.minutes, 0);

  const availableStatuses = useMemo<SkillStatus[]>(() => ["active", "paused", "completed"], []);

  if (!skill) {
    return (
      <section className="border border-slate-300 bg-white p-6">
        <p>Навык не найден.</p>
        <Link className="font-black text-teal-800" to="/dashboard">
          Вернуться к обзору
        </Link>
      </section>
    );
  }

  const requestReview = () => updateReview(skill.id, "requested", skill.mentorNote);
  const finishReview = (status: ReviewStatus) => updateReview(skill.id, status, mentorNote || skill.mentorNote);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="grid gap-5 border border-slate-300 bg-white/95 p-7 shadow-[0_18px_50px_rgba(35,57,55,0.09)] xl:col-span-2 xl:grid-cols-[1fr_auto]">
        <div>
          <Link className="mb-4 inline-block font-black text-teal-800" to="/dashboard">
            Назад к обзору
          </Link>
          <span className="block text-xs font-black uppercase text-slate-500">{skill.category}</span>
          <h2 className="text-4xl font-black text-slate-950">{skill.title}</h2>
          <p className="mt-2 text-slate-600">
            Уровень {skill.currentLevel} из {skill.targetLevel}. Накоплено {minutesLabel(totalMinutes)} практики.
          </p>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          {availableStatuses.map((status) => (
            <button
              className={`px-4 py-3 font-black transition ${
                skill.status === status ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
              key={status}
              onClick={() => updateSkillStatus(skill.id, status)}
            >
              {status === "active" ? "Активен" : status === "paused" ? "Пауза" : "Завершен"}
            </button>
          ))}
        </div>
      </section>

      <div className="grid content-start gap-5">
        <GoalList goals={goals} onCreate={(title, dueDate) => createGoal(skill.id, title, dueDate)} onToggle={toggleGoal} />
        <PracticeFeed logs={skillLogs} skills={[skill]} />
      </div>

      <aside className="grid content-start gap-5">
        <PracticeLogForm onAdd={(minutes, note, practicedAt) => addPracticeLog(skill.id, minutes, note, practicedAt)} />
        <section className="grid gap-4 border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]">
          <div>
            <span className="text-xs font-black uppercase text-slate-500">проверка</span>
            <h2 className="text-2xl font-black text-slate-950">Наставник</h2>
          </div>
          {skill.mentorNote && <div className="border-l-4 border-teal-800 bg-slate-50 p-3 text-slate-600">{skill.mentorNote}</div>}
          {profile?.role === "mentor" ? (
            <>
              <textarea value={mentorNote} onChange={(event) => setMentorNote(event.target.value)} className={textareaClass} placeholder="Комментарий по прогрессу" />
              <button className="bg-teal-800 px-4 py-3 font-black text-white transition hover:bg-teal-900" onClick={() => finishReview("reviewed")}>
                Отметить проверенным
              </button>
            </>
          ) : (
            <button className="bg-teal-800 px-4 py-3 font-black text-white transition hover:bg-teal-900" onClick={requestReview}>
              Отправить на проверку
            </button>
          )}
        </section>
      </aside>
    </div>
  );
};
