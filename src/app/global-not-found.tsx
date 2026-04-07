import Link from 'next/link';
import './globals.css';

const LINK_CLASS_NAME =
  'inline-flex items-center justify-center rounded-[46px] px-6.5 py-4 text-lg leading-[1.1] transition-colors focus:outline-none focus-visible:ring-2';

export default function GlobalNotFound() {
  return (
    <html lang="ru">
      <body className="antialiased">
        <main className="flex min-h-screen bg-white px-4 py-12.5 md:px-35">
          <section className="flex w-full flex-col items-start justify-center gap-6 rounded-[30px] bg-[#F7F7F7] px-6 py-10 md:min-h-110 md:px-10 md:py-12">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-[18px] font-medium leading-[1.1] text-[#565EEF] shadow-[0px_4px_20px_-12px_rgba(0,0,0,0.2)]">
              Ошибка 404
            </span>

            <div className="flex max-w-160 flex-col gap-4">
              <h1 className="font-['StratosSkyeng'] text-[32px] leading-[1.1] text-black md:max-w-120 md:text-[56px]">
                Страница не найдена
              </h1>
              <p className="max-w-110 text-[18px] leading-tight text-[#565EEF]">
                Возможно, ссылка устарела, курс был удален или адрес введен с ошибкой.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href="/"
                className={`${LINK_CLASS_NAME} bg-[#BCEC30] text-black hover:bg-[#C6FF00] active:bg-[#BCEC30] focus-visible:ring-[#BCEC30]/50`}
              >
                На главную
              </Link>
              <Link
                href="/courses"
                className={`${LINK_CLASS_NAME} border border-black text-black hover:bg-white active:bg-[#E9ECED] focus-visible:ring-black/20`}
              >
                Открыть каталог
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
