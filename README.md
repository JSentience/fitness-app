# Fitness App

Веб-приложение для онлайн-тренировок на `Next.js 16` с каталогом курсов, страницами деталей курса, личным кабинетом и просмотром тренировок с сохранением прогресса.

## Возможности

- просмотр списка курсов на главной странице и на маршруте `/courses`
- страница курса с описанием, направлениями и кнопкой добавления в профиль
- авторизация и регистрация через внешний API
- личный кабинет с выбранными курсами и списком тренировок
- переход к тренировке и сохранение пользовательского прогресса
- хранение сессии в `httpOnly` cookie и пользовательских данных в `localStorage`

## Стек

- `Next.js 16` + `React 19`
- `TypeScript`
- `Tailwind CSS v4`
- `Zustand` для клиентского состояния авторизации
- `ESLint`

## Маршруты

- `/` - главная страница, показывает список курсов
- `/courses` - список курсов
- `/courses/[courseId]` - страница выбранного курса
- `/profile` - личный кабинет пользователя
- `/courses/[courseId]/workouts/[workoutId]` - страница тренировки
- `/workout?courseId=...&workoutId=...` - legacy-маршрут с редиректом на новую структуру URL

## Запуск проекта

```bash
npm install
npm run dev
```

После запуска приложение доступно по адресу `http://localhost:3000`.

## Скрипты

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Переменные окружения

Проект использует внешний fitness API. Нужна переменная:

```env
NEXT_PUBLIC_FITNESS_API_URL="https://wedev-api.sky.pro/api/fitness"
```

Сейчас в проекте уже есть файл [`.env`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/.env) с этим значением.

## Структура проекта

```text
src/
  app/                     app router страницы
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

## Как устроены данные

- каталог курсов загружается с внешнего API через `src/lib/courses-api.ts`
- авторизация выполняется через `src/lib/auth-api.ts`
- выбранные пользователем курсы синхронизируются через `src/lib/user-courses-api.ts`
- прогресс тренировок читается и сохраняется через `src/lib/workouts-api.ts`
- серверная сессия хранится в `httpOnly` cookie `fitness-auth-token`
- в `localStorage` сохраняются только пользовательские данные и список выбранных курсов для клиентской гидрации

## Особенности реализации

- проект использует `App Router`
- в `next.config.ts` включен `reactCompiler`
- для API-запросов на серверных страницах в основном используется `cache: "no-store"`
- часть страниц поддерживает старые query-параметры и перенаправляет на новые nested routes

## Проверка качества

Для проверки линтера:

```bash
npm run lint
```

## Планы для развития

- добавить тесты для API-слоя и store
- вынести общую обработку ошибок API в единый helper
- оформить `.env.example`
- обновить `metadata` в [`src/app/layout.tsx`](/Users/sergey-nasonov/Yandex.Disk.localized/HTML/sky-pro/fitness-app/src/app/layout.tsx)
