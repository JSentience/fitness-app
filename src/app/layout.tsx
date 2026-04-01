import { Container } from '@/components/Container/Container';
import { Header } from '@/components/Header/Header';
import { ToastViewport } from '@/components/Toast/ToastViewport';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  applicationName: 'SkyFitnessPro',
  title: {
    default: 'SkyFitnessPro',
    template: '%s | SkyFitnessPro',
  },
  description:
    'Онлайн-тренировки для занятий дома: каталог курсов, личный кабинет и сохранение прогресса по тренировкам.',
  keywords: [
    'SkyFitnessPro',
    'онлайн-тренировки',
    'фитнес',
    'домашние тренировки',
    'каталог курсов',
    'прогресс тренировок',
  ],
  openGraph: {
    title: 'SkyFitnessPro',
    description:
      'Онлайн-тренировки для занятий дома: каталог курсов, личный кабинет и сохранение прогресса по тренировкам.',
    siteName: 'SkyFitnessPro',
    type: 'website',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary',
    title: 'SkyFitnessPro',
    description:
      'Онлайн-тренировки для занятий дома: каталог курсов, личный кабинет и сохранение прогресса по тренировкам.',
  },
  category: 'fitness',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        <Container>
          <Header />
          {children}
        </Container>
        <ToastViewport />
      </body>
    </html>
  );
}
