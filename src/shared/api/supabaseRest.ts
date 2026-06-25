const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

type ErrorPayload = {
  code?: string;
  error?: string;
  error_code?: string;
  message?: string;
  msg?: string;
};

const readError = (text: string, fallback: string) => {
  if (!text) return fallback;

  try {
    const payload = JSON.parse(text) as ErrorPayload;
    const message = payload.message ?? payload.msg ?? payload.error ?? fallback;
    const code = payload.code ?? payload.error_code;
    const lower = message.toLowerCase();

    if (code === "PGRST205") return "В Supabase не найдена нужная таблица. Выполните SQL из supabase/schema.sql.";
    if (code === "user_already_exists") return "Пользователь с таким email уже зарегистрирован.";
    if (lower.includes("invalid login credentials")) return "Неверный email или пароль.";
    if (lower.includes("email signups are disabled")) return "Регистрация по email отключена в настройках Supabase.";
    if (lower.includes("infinite recursion")) return "В Supabase осталась старая RLS-политика. Повторно выполните файл supabase/schema.sql.";
    if (lower.includes("row-level security")) return "Supabase отклонил запрос из-за правил доступа. Проверьте RLS-политики.";
    if (lower.includes("user already registered")) return "Пользователь с таким email уже зарегистрирован.";

    return message;
  } catch {
    return text;
  }
};

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

export const requireSupabaseConfig = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Заполните VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в файле .env.");
  }

  return { supabaseUrl, supabaseKey };
};

export const restRequest = async <T,>(path: string, options: RequestInit = {}, token?: string) => {
  const config = requireSupabaseConfig();
  const response = await fetch(`${config.supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.supabaseKey,
      Authorization: `Bearer ${token ?? config.supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(readError(await response.text(), "Supabase вернул ошибку запроса."));
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};

export const authRequest = async <T,>(path: string, options: RequestInit = {}, token?: string) => {
  const config = requireSupabaseConfig();
  const response = await fetch(`${config.supabaseUrl}/auth/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.supabaseKey,
      Authorization: `Bearer ${token ?? config.supabaseKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(readError(await response.text(), "Supabase Auth вернул ошибку."));
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
};
