import { Container } from '@/components/Container/Container';
import { Header } from '@/components/Header/Header';
import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  variable: '--font-roboto-sans',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

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
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <Container>
          <Header />
          {children}
        </Container>
      </body>
    </html>
  );
}
