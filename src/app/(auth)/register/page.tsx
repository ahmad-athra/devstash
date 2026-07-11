import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const RegisterForm = dynamic(() => import('@/components/auth/RegisterForm'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      <p className="text-xs text-zinc-500">Loading registration...</p>
    </div>
  ),
});

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        <p className="text-xs text-zinc-500">Loading registration...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
