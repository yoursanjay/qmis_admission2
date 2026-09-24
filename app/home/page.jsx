'use client';

import { useEffect } from 'react';
import ApplyPage from '../apply/page';

export default function HomePage() {
  useEffect(() => {
    document.cookie = 'qmis-return-to-home=; Max-Age=0; Path=/; SameSite=Lax';
  }, []);

  return <ApplyPage />;
}
