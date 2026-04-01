# SkyFitnessPro

Веб-приложение для онлайн-тренировок на `Next.js 16` с каталогом курсов, авторизацией, личным кабинетом, выбором тренировок и сохранением прогресса.

## Что умеет приложение

- показывает каталог курсов на `/` и `/courses`
- открывает детальную страницу курса с описанием, направлениями и CTA на добавление в профиль
- поддерживает регистрацию и вход через внешний fitness API
- хранит серверную сессию в `httpOnly` cookie
- показывает личный кабинет с выбранными курсами и прогрессом по ним
- дает выбрать тренировку внутри курса и перейти на nested route тренировки
- сохраняет прогресс тренировки локально и на сервере
- показывает глобальные toast-уведомления для коротких success/error-сценариев
- отдает кастомную `404`-страницу через `app/not-found.tsx`
- использует внутренние `Next.js` route handlers как proxy-слой к внешнему API

## Технологии

- `Next.js 16`
- `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `Zustand`
- `Jest` + `React Testing Library`
- `ESLint`
- `Bun`

## Архитектура

Проект разделен на несколько слоев:

- `src/app` — страницы App Router и внутренние `/api` route handlers
- `src/lib` — доступ к данным, нормализация ответов, клиентские и серверные API helper'ы
- `src/store` — Zustand-stores авторизации и toast-уведомлений
- `src/components` — UI-примитивы, layout, модалки, каталог, профиль и workout-flow
- `src/types` — общие типы

Главный принцип:

- браузер не ходит напрямую во внешний fitness API
- клиент вызывает только внутренние маршруты `/api/...`
- route handlers читают auth-cookie и проксируют запросы во внешний API
- часть клиентского состояния хранится локально для быстрой гидрации интерфейса

## Пользовательские сценарии

### Каталог и детали курса

- `/` и `/courses` рендерят каталог через серверный `CoursesList`
- `/courses/[courseId]` загружает курс на сервере и показывает экран, собранный из `CourseHero`, `CourseFittingSection`, `CourseDirectionsSection`, `CourseSection`
- добавление и удаление курса работают через внутренние `/api/users/me/courses*`

### Авторизация

- клиентская auth-форма находится в `src/components/Modal/Modal/index.tsx`
- auth-state управляется через `src/store/auth.store.ts`
- успешный login/register завершается выставлением `httpOnly` cookie и session-hint cookie

### Профиль и тренировки

- `/profile` рендерит `ProfileClient`
- список курсов пользователя и их прогресс собираются в `useWorkoutCourses`
- выбор тренировки управляется `useWorkoutSelectionModal`
- страница тренировки `/courses/[courseId]/workouts/[workoutId]` использует `WorkoutLessonClient`
- данные активной тренировки и сохранение прогресса инкапсулированы в `useActiveWorkout`

## Маршруты

- `/` — главная страница с каталогом курсов
- `/courses` — каталог курсов
- `/courses/[courseId]` — страница курса
- `/profile` — личный кабинет
- `/courses/[courseId]/workouts/[workoutId]` — страница тренировки
- `/workout?courseId=...&workoutId=...` — legacy route с редиректом на новый nested route
- `/_not-found` — системный output App Router для кастомной 404-страницы

## Внутренние API routes

- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/me`
- `/api/auth/logout`
- `/api/users/me/courses`
- `/api/users/me/courses/[courseId]`
- `/api/users/me/progress`
- `/api/courses/[courseId]/workouts`
- `/api/courses/[courseId]/workouts/[workoutId]`
- `/api/workouts/[workoutId]`

Эти маршруты:

- валидируют входные данные
- читают auth-cookie
- нормализуют ошибки внешнего API
- возвращают предсказуемые JSON-ответы для клиента

## Ключевые модули

### Data layer

- [`src/lib/fitness-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/fitness-api.ts) — низкоуровневый доступ к внешнему fitness API
- [`src/lib/client-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/client-api.ts) — низкоуровневый доступ к внутренним `/api` роутам
- [`src/lib/client-endpoints.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/client-endpoints.ts) — централизованные URL client-side эндпоинтов
- [`src/lib/auth-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/auth-api.ts) — auth и профиль пользователя
- [`src/lib/courses-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/courses-api.ts) — каталог и детали курсов
- [`src/lib/workouts-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/workouts-api.ts) — тренировки и прогресс

### Session и route helpers

- [`src/lib/auth-session.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/auth-session.ts) — localStorage/session-hint логика
- [`src/lib/auth-route.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/auth-route.ts) — успешные auth/logout responses
- [`src/lib/route-response.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/route-response.ts) — общие route response helper'ы
- [`src/lib/server-auth.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/server-auth.ts) — server-side auth-cookie access

### Client state

- [`src/store/auth.store.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/store/auth.store.ts) — авторизация, пользователь, курсы, auth modal, user menu
- [`src/store/toast.store.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/store/toast.store.ts) — глобальное состояние уведомлений
- [`src/lib/notify.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/notify.ts) — единая точка вызова toast-уведомлений

### Workout flow

- [`src/app/profile/ProfileClient.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/profile/ProfileClient.tsx)
- [`src/components/WorkoutPage/hooks/useWorkoutCourses.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/components/WorkoutPage/hooks/useWorkoutCourses.ts)
- [`src/app/courses/[courseId]/workouts/[workoutId]/WorkoutLessonClient.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/courses/[courseId]/workouts/[workoutId]/WorkoutLessonClient.tsx)
- [`src/components/WorkoutPage/hooks/useActiveWorkout.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/components/WorkoutPage/hooks/useActiveWorkout.ts)

## Структура компонентов

В `src/components` используется правило:

- один компонент живет в своей папке либо как одиночный файл в собственной директории компонента
- для связанных доменов остаются grouping folders:
  - `WorkoutPage`
  - `CourseDetails`
  - `Modal`

Примеры:

- [`src/components/WorkoutPage/WorkoutDashboard/index.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/components/WorkoutPage/WorkoutDashboard/index.tsx)
- [`src/components/WorkoutPage/WorkoutSession/index.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/components/WorkoutPage/WorkoutSession/index.tsx)
- [`src/components/CourseDetails/CourseHero/index.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/components/CourseDetails/CourseHero/index.tsx)
- [`src/components/Modal/Modal/index.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/components/Modal/Modal/index.tsx)

Также в проекте есть UI-примитивы:

- `Button`
- `ControlButton`
- `BodyText`
- `SectionTitle`
- `TextInput`
- `SurfaceCard`
- `Container`

## Устойчивость и деградация

В проекте уже учтены частые edge-cases:

- при недоступности внешнего fitness API каталог не валится в `500`, а показывает fallback
- optional progress requests деградируют в `null`, а не в hard-failure
- logout локально завершается даже при ошибке server logout
- анонимный пользователь не дергает `/api/auth/me` без session hint
- для невалидных URL и `notFound()` работает кастомная 404-страница

## Тесты и проверки

В проекте настроены:

- `eslint`
- `typescript`
- `jest`
- production `next build`

Тестами покрыты:

- route handlers
- data-layer helper'ы
- Zustand store
- hooks workout-flow
- ключевые page/client containers

## Запуск

```bash
bun install
bun run dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

## Скрипты

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run test
bun run test:watch
bun run test:coverage
bun run format
bun run format:check
```

## Переменные окружения

Нужна переменная:

```env
NEXT_PUBLIC_FITNESS_API_URL="https://wedev-api.sky.pro/api/fitness"
```

Файл `.env` в проекте уже используется для локального запуска.



## Дополнительная документация

Подробный разбор слоев и потоков проекта лежит в [PROJECT_WALKTHROUGH.md](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/PROJECT_WALKTHROUGH.md).
