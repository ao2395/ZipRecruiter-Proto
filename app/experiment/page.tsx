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

  // Step 2: Handle questionnaire submission
  const handleQuestionnaireSubmit = async (data: ParticipantCreate) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create participant
      const response = await api.createParticipant(data);
      setParticipantData(data);
      setParticipantId(response.participant_id);

      // Fetch comparisons
      const comparisonsData = await api.getComparisons(response.participant_id, 5);
      setComparisons(comparisonsData);

      // Move to step 3 (comparisons)
      setCurrentStep(3);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Handle job selection
  const handleJobSelection = async (selectedJob: 1 | 2) => {
    if (!participantId) return;

    const comparison = comparisons[currentComparisonIndex];

    console.log('handleJobSelection called:', {
      selectedJob,
      currentComparisonIndex,
      totalComparisons: comparisons.length,
      comparisonId: comparison.id
    });

    try {
      // Submit response with complete job data
      await api.submitResponse({
        participant_id: participantId,
        comparison_id: comparison.id,
        selected_job: selectedJob,
        job1: comparison.job1,
        job2: comparison.job2,
      });

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
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to submit response. Please try again.');
      }
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
