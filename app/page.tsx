'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome to Our Job Matching Service
          </h1>

          <p className="text-lg text-gray-700">
            We're building an AI-powered job-matching service designed to help people find
            roles that better fit their skills, preferences, and priorities.
          </p>

          <p className="text-lg text-gray-700">
            We'd like to invite you to try it out.
          </p>

          <p className="text-gray-600">
            By clicking the link below, you'll spend about three minutes chatting with our
            assistant, answering a few questions to understand the type of job profiles
            and companies you are looking for. Your responses will help us to match you
            with better roles and employers and share personalized job recommendations
            with you.
          </p>

          <div className="pt-4">
            <Link href="/experiment">
              <Button size="lg" className="w-full md:w-auto px-8">
                Try it now
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            This should take approximately 3 minutes to complete.
          </p>
        </div>
      </Card>
    </div>
  );
}