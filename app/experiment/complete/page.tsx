'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useExperimentStore } from '@/lib/experimentStore';
import { CheckCircle } from 'lucide-react';

export default function CompletePage() {
  const { reset, participantData } = useExperimentStore();

  useEffect(() => {
    // Optional: Reset store after showing completion
    // Uncomment if you want to clear data after completion
    // const timer = setTimeout(() => reset(), 5000);
    // return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Thank you!</h1>

          <p className="text-lg text-gray-700">
            Thank you for letting me know your preferences{participantData?.name ? `, ${participantData.name}` : ''}.
          </p>

          <p className="text-gray-600">
            I will now go ahead and search for the most suitable jobs for you.
          </p>

          <p className="text-gray-600 font-medium">
            Please look out for an email from us soon!
          </p>

          <div className="pt-6">
            {/* <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link> */}
          </div>
        </div>
      </Card>
    </div>
  );
}
