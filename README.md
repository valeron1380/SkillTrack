# SkillTrack

SkillTrack - учебный трекер навыков и практики. Пользователь ведет список навыков, ставит цели, записывает время практики и может отправить навык на проверку наставнику.

## Стек

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS 4.3
- Supabase Auth
- Supabase PostgreSQL

## Возможности

- регистрация и вход через Supabase Auth;
- профиль пользователя с направлением обучения и аватаром;
- роли `student` и `mentor`;
- создание навыков с текущим и целевым уровнем;
- цели по каждому навыку;
- журнал практики с датой, временем и заметкой;
- отправка навыка на проверку наставнику;
- комментарий наставника по прогрессу;
- защищенные страницы через React Router;
- интерфейс на Tailwind utility-классах;
- структура проекта по FSD.

## Запуск

```bash
npm install
npm run dev
```

Создайте `.env` на основе `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## База данных

Откройте Supabase SQL Editor и выполните файл:

```text
supabase/schema.sql
```

В схеме включены таблицы, индексы, RLS-политики и функция `current_user_is_mentor()`, которая убирает рекурсию политик при проверке роли наставника.

После регистрации пользователь получает роль `student`. Чтобы сделать аккаунт наставником, измените роль вручную в таблице `profiles`:

```sql
update public.profiles
set role = 'mentor'
where email = 'mentor@mail.ru';
```

## Структура

```text
src/app          маршруты и состояние приложения
src/pages        страницы
src/widgets      крупные блоки интерфейса
src/features     пользовательские действия
src/entities     модели и репозитории
src/shared       общие API и утилиты
```

## Проверка

```bash
npm run build
```
