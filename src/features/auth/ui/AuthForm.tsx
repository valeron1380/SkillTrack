import { useState, type FormEvent } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
  onSubmit: (payload: { email: string; password: string; displayName: string }) => Promise<void>;
};

const fieldClass =
  "w-full border border-slate-300 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/15";
const labelClass = "grid gap-2 text-sm font-bold text-slate-700";

export const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Введите корректный email.");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен быть не короче 6 символов.");
      return;
    }
    if (mode === "signup" && displayName.trim().length < 2) {
      setError("Введите имя профиля.");
      return;
    }

    try {
      setSending(true);
      await onSubmit({ email, password, displayName });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Не удалось выполнить действие.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      className="grid content-center gap-5 border border-slate-300 bg-white/95 p-8 shadow-[0_18px_50px_rgba(35,57,55,0.09)]"
      onSubmit={submit}
    >
      <div>
        <span className="text-xs font-black uppercase text-slate-500">SkillTrack</span>
        <h1 className="mt-1 text-3xl font-black text-slate-950">
          {mode === "login" ? "Вход в кабинет" : "Создание аккаунта"}
        </h1>
        <p className="mt-2 text-slate-500">
          {mode === "login"
            ? "Продолжите вести прогресс по навыкам."
            : "Создайте профиль и начните план обучения."}
        </p>
      </div>

      {mode === "signup" && (
        <label className={labelClass}>
          Имя профиля
          <input
            className={fieldClass}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Например: Валерий"
          />
        </label>
      )}

      <label className={labelClass}>
        Email
        <input className={fieldClass} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@mail.ru" />
      </label>

      <label className={labelClass}>
        Пароль
        <input
          className={fieldClass}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Минимум 6 символов"
        />
      </label>

      {error && <div className="border border-red-200 bg-red-50 p-3 font-bold text-red-700">{error}</div>}

      <button className="bg-teal-800 px-4 py-3 font-black text-white transition hover:bg-teal-900 disabled:opacity-60" disabled={sending}>
        {sending ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
      </button>
    </form>
  );
};
