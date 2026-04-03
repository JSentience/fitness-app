# SkyFitnessPro

`SkyFitnessPro` — веб-приложение для онлайн-тренировок на `Next.js 16`, `React 19` и `TypeScript`. В проекте есть каталог курсов, авторизация пользователей, личный кабинет с подключенными курсами, сценарий выбора тренировки и сохранение прогресса через внутренние API-маршруты.

## Возможности приложения

- показывает каталог курсов на главной странице и на `/courses`
- открывает детальную страницу курса с hero-блоком, описанием, направлениями и CTA-действиями
- поддерживает регистрацию и вход через внешний fitness API
- хранит активную сессию в `httpOnly` cookie
- показывает личный кабинет с подключенными курсами и прогрессом
- открывает поток тренировки на отдельной странице занятия
- сохраняет прогресс локально и отправляет обновления на сервер
- показывает глобальные `success` и `error` toast-уведомления
- использует внутренние `Next.js` route handlers как proxy-слой к внешнему API
- отдает кастомную `404`-страницу через App Router

## Стек технологий

- `Next.js 16.1.6`
- `React 19.2.3`
- `TypeScript 5`
- `Tailwind CSS v4`
- `Zustand`
- `Jest 30`
- `React Testing Library`
- `ESLint 9`
- `Prettier 3`
- `Bun`

## Что нужно для запуска

Для локального запуска нужны:

- установленный `Bun`
- доступ к fitness API, настроенный через переменные окружения

## Быстрый старт

1. Установите зависимости:

```bash
bun install
```

2. Создайте или обновите файл окружения:

```bash
cp .env.example .env
```

3. Укажите базовый URL API в `.env`:

```env
NEXT_PUBLIC_FITNESS_API_URL="https://wedev-api.sky.pro/api/fitness"
```

4. Запустите dev-сервер:

```bash
bun run dev
```

После запуска приложение будет доступно по адресу `http://localhost:3000`.

## Доступные скрипты

| Команда | Назначение |
| --- | --- |
| `bun run dev` | запускает dev-сервер |
| `bun run build` | собирает production-бандл |
| `bun run start` | запускает production-сервер на собранном приложении |
| `bun run lint` | запускает проверки `eslint` |
| `bun run test` | запускает весь набор тестов |
| `bun run test:watch` | запускает тесты в watch-режиме |
| `bun run test:coverage` | собирает покрытие тестами |
| `bun run format` | форматирует проект через `prettier` |
| `bun run format:check` | проверяет форматирование без записи изменений |

## Переменные окружения

Сейчас в проекте используется одна обязательная переменная:

| Переменная | Назначение |
| --- | --- |
| `NEXT_PUBLIC_FITNESS_API_URL` | базовый URL внешнего fitness API, который используют серверные и клиентские helper'ы |

В репозитории уже есть `.env.example` с нужным именем переменной.

## Маршруты приложения

| Маршрут | Назначение |
| --- | --- |
| `/` | главная страница с каталогом курсов |
| `/courses` | полная страница каталога |
| `/courses/[courseId]` | детальная страница курса |
| `/profile` | личный кабинет с подключенными курсами и прогрессом |
| `/courses/[courseId]/workouts/[workoutId]` | страница занятия тренировки |
| `/workout?courseId=...&workoutId=...` | legacy route с редиректом на nested route тренировки |
| `/_not-found` | системный output для кастомной `404`-страницы App Router |

## Внутренние API-маршруты

Браузер не общается с внешним fitness API напрямую. Все клиентские запросы проходят через внутренние обработчики в `src/app/api`.

### Авторизация

- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/me`
- `/api/auth/logout`

### Курсы пользователя и прогресс

- `/api/users/me/courses`
- `/api/users/me/courses/[courseId]`
- `/api/users/me/progress`

### Тренировки

- `/api/courses/[courseId]/workouts`
- `/api/courses/[courseId]/workouts/[workoutId]`
- `/api/workouts/[workoutId]`

Эти обработчики отвечают за:

- валидацию входных данных
- чтение auth-cookie на сервере
- проксирование запросов во внешний API
- нормализацию ошибок бэкенда
- возврат предсказуемых JSON-ответов для UI

## Архитектура

Проект разделен на слои с явным разделением ответственности между UI, клиентским состоянием, route handlers и API-helper'ами.

### Основные слои

- `src/app` содержит страницы App Router, layouts, error pages и внутренние API-обработчики
- `src/components` содержит UI-примитивы и доменные компоненты для каталога, деталей курса, модалок и workout-flow
- `src/lib` содержит API-клиенты, route-helper'ы, auth-helper'ы, утилиты нормализации и feature-level бизнес-логику
- `src/store` содержит Zustand-store для авторизации и toast-уведомлений
- `src/types` содержит общие TypeScript-типы

### Поток данных

1. Пользователь взаимодействует с клиентскими компонентами.
2. Клиентский код вызывает внутренние эндпоинты `/api/...`.
3. Route handlers читают session-cookie и обращаются к внешнему fitness API.
4. Ответы нормализуются и возвращаются в стабильной структуре.
5. Клиентские store и hooks обновляют состояние интерфейса.

Такой подход уменьшает связанность между браузером и внешним бэкендом и оставляет auth-логику на серверной стороне.

## Ключевые модули

### Слой данных и API

- `src/lib/fitness-api.ts` — низкоуровневый клиент внешнего fitness API
- `src/lib/client-api.ts` — низкоуровневый клиент внутренних `/api`-маршрутов
- `src/lib/client-endpoints.ts` — централизованные client-side пути к эндпоинтам
- `src/lib/auth-api.ts` — операции авторизации и получения текущего пользователя
- `src/lib/courses-api.ts` — работа с каталогом и деталями курсов
- `src/lib/workouts-api.ts` — работа с тренировками и сохранением прогресса
- `src/lib/user-courses-api.ts` — операции над курсами пользователя

### Сессионные и auth-helper'ы

- `src/lib/server-auth.ts` — чтение auth-cookie на сервере
- `src/lib/auth-route.ts` — формирование успешных auth/logout ответов
- `src/lib/auth-session.ts` — управление browser session hint и локальной гидрацией состояния
- `src/lib/route-response.ts` — общие helper'ы для route responses

### Клиентское состояние

- `src/store/auth.store.ts` — хранение auth-state, текущего пользователя, состояния модалки и user menu
- `src/store/toast.store.ts` — глобальное состояние toast-уведомлений
- `src/lib/notify.ts` — единая точка вызова уведомлений

### Сценарий тренировки

- `src/app/profile/ProfileClient.tsx` — основной клиентский экран профиля
- `src/components/WorkoutPage/hooks/useWorkoutCourses.ts` — сбор курсов пользователя и прогресса для workout dashboard
- `src/app/courses/[courseId]/workouts/[workoutId]/WorkoutLessonClient.tsx` — клиентская логика страницы занятия
- `src/components/WorkoutPage/hooks/useActiveWorkout.ts` — управление активной тренировкой и сохранением прогресса

## Структура проекта

```text
.
├── public/                  # статические ассеты: иконки, изображения курсов, брендовые материалы
├── src/
│   ├── app/                 # страницы App Router и внутренние API routes
│   ├── components/          # UI-примитивы и feature-компоненты
│   ├── lib/                 # API-клиенты, helper'ы, утилиты, бизнес-логика
│   ├── store/               # Zustand-store
│   └── types/               # общие TypeScript-типы
├── .env.example             # пример имен переменных окружения
├── eslint.config.mjs        # конфигурация ESLint
├── jest.config.mjs          # конфигурация Jest на базе next/jest
├── next.config.ts           # конфигурация Next.js с React Compiler и globalNotFound
└── tsconfig.json            # конфигурация TypeScript с алиасом @/*
```

## Организация UI

`src/components` сочетает общие примитивы и сгруппированные feature-модули.

### Общие примитивы

- `Button`
- `ControlButton`
- `BodyText`
- `SectionTitle`
- `TextInput`
- `SurfaceCard`
- `Container`

### Feature-группы

- `CourseDetails`
- `Modal`
- `WorkoutPage`

Такой подход отделяет маленькие переиспользуемые UI-блоки от более сложных доменных сценариев.

## Тесты и контроль качества

В проекте уже есть:

- unit-тесты для helper'ов и утилит
- тесты для route handlers
- тесты для Zustand-store
- тесты для workout hooks и логики прогресса
- тесты для ключевых страниц и клиентских контейнеров

Jest-конфигурация построена на `next/jest`, использует `jsdom` и подключает общий setup из `jest.setup.ts`.

Перед релизом разумно прогнать:

```bash
bun run lint
bun run test
bun run build
```

## Устойчивость и деградация

В текущей реализации уже закрыты несколько частых сценариев деградации:

- если внешний fitness API недоступен, каталог не падает в жесткий `500`, а показывает fallback
- optional progress requests могут деградировать в `null`, не ломая страницу
- logout завершается локально даже при ошибке server-side logout
- анонимный пользователь не дергает `/api/auth/me` без session hint
- невалидные маршруты и отсутствующие сущности отдают кастомную `404`-страницу

## Заметки для разработки

- проект использует алиас `@/*` для импортов из `src`
- `Next.js` React Compiler включен в `next.config.ts`
- experimental `globalNotFound` включен
- скрипты для форматирования и линтинга уже настроены в репозитории
