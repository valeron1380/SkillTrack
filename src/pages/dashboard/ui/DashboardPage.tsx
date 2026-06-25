import { useSkillTrackContext } from "../../../app/SkillTrackContext";
import { SkillCreateForm } from "../../../features/skill-create/ui/SkillCreateForm";
import { minutesLabel } from "../../../shared/lib/date";
import { PracticeFeed } from "../../../widgets/practice-feed/ui/PracticeFeed";
import { SkillCard } from "../../../widgets/skill-overview/ui/SkillCard";

export const DashboardPage = () => {
  const { skills, goalsBySkill, logs, stats, createSkill, profile, error, loading } = useSkillTrackContext();

  if (loading) return <div className="border border-slate-300 bg-white p-6">Загрузка кабинета...</div>;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="grid gap-6 border border-slate-300 bg-white/95 p-7 shadow-[0_18px_50px_rgba(35,57,55,0.09)] xl:col-span-2 xl:grid-cols-[1fr_auto]">
        <div>
          <span className="text-xs font-black uppercase text-slate-500">учебная траектория</span>
          <h2 className="mt-1 text-4xl font-black text-slate-950">
            {profile?.role === "mentor" ? "Проверка прогресса студентов" : "План развития на неделю"}
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Ведите навыки, фиксируйте практику и собирайте доказательства прогресса без таблиц и случайных заметок.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="grid min-w-32 bg-emerald-50 p-4">
            <strong className="text-3xl">{skills.length}</strong>
            <span>навыков</span>
          </div>
          <div className="grid min-w-32 bg-emerald-50 p-4">
            <strong className="text-3xl">{minutesLabel(stats.totalMinutes)}</strong>
            <span>практики</span>
          </div>
          <div className="grid min-w-32 bg-emerald-50 p-4">
            <strong className="text-3xl">{stats.completedGoals}</strong>
            <span>целей</span>
          </div>
        </div>
      </section>

      {error && <div className="border border-red-200 bg-red-50 p-3 font-bold text-red-700 xl:col-span-2">{error}</div>}

      <div className="grid content-start gap-5">
        <section className="border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]">
          <div className="mb-5">
            <span className="text-xs font-black uppercase text-slate-500">навыки</span>
            <h2 className="text-2xl font-black text-slate-950">Карта развития</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {skills.length === 0 && <p className="text-slate-500">Добавьте первый навык, чтобы начать вести прогресс.</p>}
            {skills.map((skill) => {
              const goals = goalsBySkill[skill.id] ?? [];
              return (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  totalGoals={goals.length}
                  completedGoals={goals.filter((goal) => goal.isDone).length}
                />
              );
            })}
          </div>
        </section>
        <PracticeFeed logs={logs} skills={skills} />
      </div>

      <aside className="grid content-start gap-5">
        <SkillCreateForm onCreate={createSkill} />
      </aside>
    </div>
  );
};
