'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatbotInterface } from '@/components/experiment/ChatbotInterface';
import { JobComparisonCard } from '@/components/experiment/JobComparisonCard';
import { ProgressIndicator } from '@/components/experiment/ProgressIndicator';
import { useExperimentStore } from '@/lib/experimentStore';
import { api, APIError } from '@/lib/api';
import type { ParticipantCreate } from '@/lib/types';

export default function ExperimentPage() {
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    setParticipantData,
    participantId,
    setParticipantId,
    comparisons,
    setComparisons,
    currentComparisonIndex,
    setCurrentComparisonIndex,
    addResponse,
    responses,
    reset,
  } = useExperimentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state on mount to ensure clean start
  useEffect(() => {
    console.log('ExperimentPage mounted, resetting state');
    reset();
  }, []);

  // Debug log for state changes
  useEffect(() => {
    console.log('State changed:', {
      currentStep,
      participantId,
      comparisonsCount: comparisons.length,
      currentComparisonIndex
    });
  }, [currentStep, participantId, comparisons.length, currentComparisonIndex]);

  // Step 2: Handle questionnaire submission (mock data - no API call)
  const handleQuestionnaireSubmit = async (data: ParticipantCreate) => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock participant ID
    const mockParticipantId = 'demo-' + Date.now();
    setParticipantData(data);
    setParticipantId(mockParticipantId);

    // Mock comparisons data
    const mockComparisons = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      job1: {
        company_description: "A technology company that develops software solutions.",
        company_size: "100-500 employees",
        compensation: "Market aligned",
        location: "Remote",
        dei_statement: "We are committed to fostering a diverse and inclusive workplace."
      },
      job2: {
        company_description: "A business services firm that provides operational solutions.",
        company_size: "500+ employees",
        compensation: "Competitive for the market",
        location: "Mostly in-office",
        dei_statement: "No additional information provided."
      }
    }));
    
    setComparisons(mockComparisons);
    setCurrentStep(3);
    setIsLoading(false);
  };

  // Step 3: Handle job selection (no API call)
  const handleJobSelection = async (selectedJob: 1 | 2) => {
    if (!participantId) return;

    const comparison = comparisons[currentComparisonIndex];

    console.log('handleJobSelection called:', {
      selectedJob,
      currentComparisonIndex,
      totalComparisons: comparisons.length,
      comparisonId: comparison.id
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Store response locally
    addResponse(comparison.id, selectedJob);

    // Move to next comparison or complete
    if (currentComparisonIndex < comparisons.length - 1) {
      console.log('Moving to next comparison:', currentComparisonIndex + 1);
      setCurrentComparisonIndex(currentComparisonIndex + 1);
    } else {
      console.log('All comparisons completed, redirecting');
      // All comparisons completed
      router.push('/experiment/complete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep === 3 ? 3 : currentStep}
          totalSteps={4}
        />

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Step 2: Questionnaire (Chatbot) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <ChatbotInterface onComplete={handleQuestionnaireSubmit} />
          </div>
        )}

        {/* Step 3: Job Comparisons */}
        {currentStep === 3 && comparisons.length > 0 && (
          <div className="space-y-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Which of these two jobs do you prefer?
              </h1>
              <p className="text-gray-600 mb-4">
                Comparison {currentComparisonIndex + 1} of {comparisons.length}
              </p>
            </div>

            <JobComparisonCard
              job1={comparisons[currentComparisonIndex].job1}
              job2={comparisons[currentComparisonIndex].job2}
              onSelectJob={handleJobSelection}
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
