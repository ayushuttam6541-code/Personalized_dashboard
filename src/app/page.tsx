import { Suspense } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { LoadingState } from '@/components/LoadingState';

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState count={6} />}>
      <Dashboard />
    </Suspense>
  );
}
