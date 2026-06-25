import { Link } from "react-router-dom";
import type { Skill } from "../../../entities/skill/model/types";

type SkillCardProps = {
  skill: Skill;
  completedGoals: number;
  totalGoals: number;
};

const statusLabel = {
  active: "активен",
  paused: "пауза",
  completed: "закрыт",
};

const reviewLabel = {
  draft: "черновик",
  requested: "на проверке",
  reviewed: "проверено",
};

export const SkillCard = ({ skill, completedGoals, totalGoals }: SkillCardProps) => {
  const progress = Math.round((skill.currentLevel / skill.targetLevel) * 100);

  return (
    <Link
      className="grid min-h-48 gap-4 border border-slate-300 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-800"
      to={`/skills/${skill.id}`}
    >
      <div className="flex items-center justify-between gap-3 text-sm font-black text-slate-500">
        <span>{skill.category}</span>
        <b className="border border-slate-300 bg-slate-50 px-2 py-1 text-slate-700">{statusLabel[skill.status]}</b>
      </div>
      <h3 className="text-2xl font-black text-slate-950">{skill.title}</h3>
      <div className="h-2 overflow-hidden bg-slate-200">
        <span className="block h-full bg-lime-300" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="border border-slate-300 bg-slate-50 px-2 py-1 text-sm font-black">
          {skill.currentLevel}/{skill.targetLevel} уровень
        </span>
        <span className="border border-slate-300 bg-slate-50 px-2 py-1 text-sm font-black">
          {completedGoals}/{totalGoals} целей
        </span>
        <span className="border border-slate-300 bg-slate-50 px-2 py-1 text-sm font-black">{reviewLabel[skill.reviewStatus]}</span>
      </div>
    </Link>
  );
};
