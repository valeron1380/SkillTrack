import { Link, useLocation } from "react-router-dom";
import { useSkillTrackContext } from "../../../app/SkillTrackContext";
import { AuthForm } from "../../../features/auth/ui/AuthForm";

export const AuthPage = () => {
  const location = useLocation();
  const isSignup = location.pathname === "/signup";
  const { signIn, signUp } = useSkillTrackContext();

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <section className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_420px]">
        <div className="flex min-h-[520px] flex-col justify-end border border-slate-300 bg-white/90 p-8 shadow-[0_18px_50px_rgba(35,57,55,0.09)] lg:p-11">
          <span className="text-xs font-black uppercase text-slate-500">личный трекер развития</span>
          <h2 className="mt-3 max-w-3xl text-5xl font-black leading-none text-slate-950 lg:text-6xl">
            Учебные навыки, цели и практика в одном кабинете
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            SkillTrack помогает вести список навыков, ставить цели, записывать практику и отправлять прогресс наставнику.
          </p>
        </div>

        <AuthForm
          mode={isSignup ? "signup" : "login"}
          onSubmit={(payload) =>
            isSignup
              ? signUp({ email: payload.email, password: payload.password, displayName: payload.displayName })
              : signIn({ email: payload.email, password: payload.password })
          }
        />

        <div className="text-center font-black text-teal-800 lg:col-start-2">
          {isSignup ? <Link to="/login">Уже есть аккаунт</Link> : <Link to="/signup">Создать аккаунт</Link>}
        </div>
      </section>
    </main>
  );
};
