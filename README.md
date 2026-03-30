# Fitness App

Веб-приложение для онлайн-тренировок на `Next.js 16` с каталогом курсов, авторизацией, личным кабинетом и просмотром тренировок с сохранением прогресса.

## Возможности

- просмотр списка курсов на главной странице и на маршруте `/courses`
- страница курса с описанием, направлениями и управлением добавлением в профиль
- авторизация и регистрация через внешний API
- личный кабинет с выбранными курсами и списком тренировок
- переход к тренировке по nested route и через legacy-редирект
- сохранение прогресса в `localStorage` и на сервере для авторизованного пользователя
- хранение сессии в `httpOnly` cookie и пользовательских данных в `localStorage`
- внутренние `Next.js` route handlers для auth, курсов и прогресса

## Стек

- `Next.js 16` + `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `Zustand` для клиентского состояния авторизации
- `Bun` как пакетный менеджер и раннер скриптов
- `Jest` + `React Testing Library`
- `ESLint`

## Маршруты

- `/` - главная страница, показывает список курсов
- `/courses` - список курсов
- `/courses/[courseId]` - страница выбранного курса
- `/profile` - личный кабинет пользователя
- `/courses/[courseId]/workouts/[workoutId]` - страница тренировки
- `/workout?courseId=...&workoutId=...` - legacy-маршрут с редиректом на новую структуру URL

## Внутренние API routes

- `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/logout` - работа с авторизацией
- `/api/users/me/courses` и `/api/users/me/courses/[courseId]` - добавление и удаление курсов пользователя
- `/api/users/me/progress` - чтение прогресса курса или конкретной тренировки
- `/api/courses/[courseId]/workouts` - список тренировок курса
- `/api/courses/[courseId]/workouts/[workoutId]` - сохранение прогресса тренировки
- `/api/workouts/[workoutId]` - получение данных конкретной тренировки

## Запуск проекта

```bash
bun install
bun run dev
```

После запуска приложение доступно по адресу `http://localhost:3000`.

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

Проект использует внешний fitness API. Нужна переменная:

```env
NEXT_PUBLIC_FITNESS_API_URL="https://wedev-api.sky.pro/api/fitness"
```

Сейчас в проекте уже есть файл [`.env`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/.env) с этим значением.

## Структура проекта

```text
jest.config.mjs            конфигурация Jest для Next.js
jest.setup.ts              setup для Jest и RTL
src/
  app/                     app router страницы
    api/                   внутренние route handlers
  components/              UI-компоненты и компоненты workout-страниц
  lib/                     работа с API, утилиты и маппинги
  store/                   zustand store авторизации
  types/                   общие типы проекта
```

Ключевые файлы:

- [`src/app/page.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/page.tsx) - главная страница
- [`src/app/profile/ProfileClient.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/profile/ProfileClient.tsx) - личный кабинет
- [`src/lib/auth-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/auth-api.ts) - авторизация и получение пользователя
- [`src/lib/courses-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/courses-api.ts) - курсы
- [`src/lib/workouts-api.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/lib/workouts-api.ts) - тренировки и прогресс
- [`src/store/auth.store.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/store/auth.store.ts) - клиентское состояние авторизации
- [`src/app/api/users/me/progress/route.ts`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/api/users/me/progress/route.ts) - внутренний API route для прогресса
- [`src/app/courses/[courseId]/workouts/[workoutId]/WorkoutLessonClient.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/courses/[courseId]/workouts/[workoutId]/WorkoutLessonClient.tsx) - клиентская логика страницы тренировки

## Как устроены данные

- каталог курсов загружается с внешнего API через `src/lib/courses-api.ts`
- авторизация выполняется через `src/lib/auth-api.ts`
- клиент общается с внешним fitness API в основном через внутренние `route handlers` в `src/app/api`
- выбранные пользователем курсы синхронизируются через `src/lib/user-courses-api.ts` и внутренние `/api/users/me/courses`
- прогресс тренировок читается и сохраняется через `src/lib/workouts-api.ts`
- серверная сессия хранится в `httpOnly` cookie `fitness-auth-token`
- в `localStorage` сохраняются только пользовательские данные и список выбранных курсов для клиентской гидрации

## Особенности реализации

- проект использует `App Router`
- в `next.config.ts` включен `reactCompiler`
- для API-запросов на серверных страницах в основном используется `cache: "no-store"`
- часть страниц поддерживает старые query-параметры и перенаправляет на новые nested routes
- внутренние course-роуты возвращают явный `courseState`, чтобы клиент не зависел от текстов ошибок API
- страница тренировки не показывает success-модалку, если сохранение прогресса завершилось ошибкой

## Проверка качества

Для проверки линтера и тестов:

```bash
bun run lint
bun run test
```

Текущие тесты покрывают:

- поведение success-модалки на странице тренировки
- корректную обработку статусов в `/api/users/me/progress`
- контракт добавления курса без зависимости от текста ошибки

## Что ещё можно улучшить

- расширить покрытие тестами для API-слоя, `zustand` store и хуков
- вынести общую обработку ошибок API в единый helper
- оформить `.env.example`
- обновить `metadata` в [`src/app/layout.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/layout.tsx)
