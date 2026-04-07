'use client';

import { Button } from '@/components/Button/Button';

export const BackToTopBtn = () => {
  return (
    <Button
      className="px-8 py-3 font-medium"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      type="button"
    >
      Наверх ↑
    </Button>
  );
};
