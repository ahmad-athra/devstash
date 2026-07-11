import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const SignInForm = dynamic(() => import('@/components/auth/SignInForm'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
      <p className="text-xs text-zinc-500">Loading authentication...</p>
    </div>
  ),
});

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
        <p className="text-xs text-zinc-500">Loading authentication...</p>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
