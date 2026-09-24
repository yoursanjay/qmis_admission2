import { cookies } from 'next/headers';
import AdmissionsLandingPage from '@/components/admissions/AdmissionsLandingPage';
import HomePage from './home/page';

export default function RootPage() {
  const returnToHome = cookies().has('qmis-return-to-home');

  return returnToHome ? <HomePage /> : <AdmissionsLandingPage />;
}
