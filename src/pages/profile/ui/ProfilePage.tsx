import { useSkillTrackContext } from "../../../app/SkillTrackContext";
import { ProfileEditForm } from "../../../features/profile-edit/ui/ProfileEditForm";

export const ProfilePage = () => {
  const { profile, updateProfile, stats } = useSkillTrackContext();

  if (!profile) return <div className="border border-slate-300 bg-white p-6">Профиль загружается...</div>;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="flex flex-col gap-5 border border-slate-300 bg-white/95 p-7 shadow-[0_18px_50px_rgba(35,57,55,0.09)] sm:flex-row sm:items-center xl:col-span-2">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden bg-lime-300 text-3xl font-black text-slate-950">
          {profile.avatarUrl ? <img className="size-full object-cover" src={profile.avatarUrl} alt="" /> : profile.displayName.slice(0, 2)}
        </div>
        <div>
          <span className="text-xs font-black uppercase text-slate-500">{profile.role === "mentor" ? "наставник" : "студент"}</span>
          <h2 className="text-4xl font-black text-slate-950">{profile.displayName}</h2>
          <p className="text-slate-600">{profile.email}</p>
        </div>
      </section>

      <ProfileEditForm profile={profile} onSave={updateProfile} />

      <section className="border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]">
        <span className="text-xs font-black uppercase text-slate-500">сводка</span>
        <h2 className="text-2xl font-black text-slate-950">Результаты</h2>
        <div className="mt-5 grid gap-3">
          <div className="grid bg-slate-50 p-4">
            <strong className="text-3xl">{stats.activeSkills}</strong>
            <span>активных навыков</span>
          </div>
          <div className="grid bg-slate-50 p-4">
            <strong className="text-3xl">{stats.completedGoals}</strong>
            <span>целей закрыто</span>
          </div>
          <div className="grid bg-slate-50 p-4">
            <strong className="text-3xl">{stats.requestedReviews}</strong>
            <span>на проверке</span>
          </div>
        </div>
      </section>
    </div>
  );
};
