import { useState, type FormEvent } from "react";
import type { Profile } from "../../../entities/profile/model/types";

type ProfileEditFormProps = {
  profile: Profile;
  onSave: (data: Pick<Profile, "displayName" | "direction" | "avatarUrl">) => Promise<void>;
};

const fieldClass =
  "w-full border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15";
const labelClass = "grid gap-2 text-sm font-bold text-slate-700";

export const ProfileEditForm = ({ profile, onSave }: ProfileEditFormProps) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [direction, setDirection] = useState(profile.direction);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [saved, setSaved] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave({ displayName, direction, avatarUrl });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <form className="grid content-start gap-4 border border-slate-300 bg-white/95 p-6 shadow-[0_18px_50px_rgba(35,57,55,0.09)]" onSubmit={submit}>
      <div>
        <span className="text-xs font-black uppercase text-slate-500">профиль</span>
        <h2 className="text-2xl font-black text-slate-950">Данные участника</h2>
      </div>
      <label className={labelClass}>
        Имя
        <input className={fieldClass} value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
      </label>
      <label className={labelClass}>
        Направление
        <select className={fieldClass} value={direction} onChange={(event) => setDirection(event.target.value)}>
          <option>Frontend</option>
          <option>Backend</option>
          <option>Fullstack</option>
          <option>Database</option>
          <option>QA</option>
        </select>
      </label>
      <label className={labelClass}>
        Ссылка на аватар
        <input className={fieldClass} value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="https://..." />
      </label>
      <button className="bg-teal-800 px-4 py-3 font-black text-white transition hover:bg-teal-900">Сохранить</button>
      {saved && <div className="border border-emerald-200 bg-emerald-50 p-3 font-bold text-emerald-700">Профиль обновлен.</div>}
    </form>
  );
};
