import { NavLink, Outlet } from "react-router-dom";
import { useSkillTrackContext } from "../../../app/SkillTrackContext";
import { minutesLabel } from "../../../shared/lib/date";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-3 font-bold transition ${isActive ? "bg-slate-700 text-white" : "text-slate-200 hover:bg-slate-800"}`;

export const AppShell = () => {
  const { profile, stats, signOut } = useSkillTrackContext();

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
      <aside className="flex gap-6 bg-slate-950 p-6 text-white lg:sticky lg:top-0 lg:h-screen lg:flex-col">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center bg-lime-300 font-black text-slate-950">ST</span>
          <div className="grid">
            <strong>SkillTrack</strong>
            <span className="text-sm text-slate-400">{profile?.role === "mentor" ? "наставник" : "студент"}</span>
          </div>
        </div>

        <nav className="grid flex-1 gap-2 lg:flex-none">
          <NavLink className={navClass} to="/dashboard">
            Обзор
          </NavLink>
          <NavLink className={navClass} to="/profile">
            Профиль
          </NavLink>
        </nav>

        <div className="hidden bg-slate-800 p-4 lg:grid">
          <span className="text-sm text-slate-400">Практика</span>
          <strong className="text-3xl">{minutesLabel(stats.totalMinutes)}</strong>
          <small className="text-slate-400">{stats.activeSkills} активных навыков</small>
        </div>

        <button className="bg-slate-800 px-4 py-3 font-black text-white transition hover:bg-slate-700" onClick={signOut}>
          Выйти
        </button>
      </aside>

      <main className="p-5 lg:p-7">
        <header className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <span className="text-xs font-black uppercase text-slate-500">{profile?.direction ?? "направление"}</span>
            <h1 className="text-4xl font-black text-slate-950">{profile?.displayName ?? "Профиль"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-700">
              {stats.completedGoals} целей закрыто
            </span>
            <span className="border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-700">
              {stats.requestedReviews} на проверке
            </span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};
