'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { JobListing } from '@/lib/types';

interface JobComparisonCardProps {
  job1: JobListing;
  job2: JobListing;
  onSelectJob: (jobNumber: 1 | 2) => void;
  disabled?: boolean;
}

export function JobComparisonCard({
  job1,
  job2,
  onSelectJob,
  disabled = false,
}: JobComparisonCardProps) {
  const [selectedJob, setSelectedJob] = useState<1 | 2 | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectedFaded, setRejectedFaded] = useState(false);
  const [selectedMoving, setSelectedMoving] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  // Reset state when jobs change (new comparison)
  useEffect(() => {
    setSelectedJob(null);
    setIsSubmitting(false);
    setRejectedFaded(false);
    setSelectedMoving(false);
    setIsEntering(true);

    // Remove entering animation after it completes
    const timer = setTimeout(() => setIsEntering(false), 600);
    return () => clearTimeout(timer);
  }, [job1, job2]);

  const handleSelect = async (jobNumber: 1 | 2) => {
    setSelectedJob(jobNumber);
    setIsSubmitting(true);

    // Wait 600ms to show selection
    setTimeout(() => {
      // Fade out rejected card
      setRejectedFaded(true);

      // After rejected card fades (800ms), move selected to center and drop
      setTimeout(() => {
        setSelectedMoving(true);

        // After move and drop animation (1500ms), submit
        setTimeout(() => {
          onSelectJob(jobNumber);
        }, 1500);
      }, 800);
    }, 600);
  };

  const renderJobCard = (job: JobListing, jobNumber: 1 | 2) => {
    const isSelected = selectedJob === jobNumber;
    const isOther = selectedJob !== null && selectedJob !== jobNumber;

    // Determine animation classes
    let animationClass = '';
    if (isEntering) {
      animationClass = jobNumber === 1
        ? 'animate-slide-in-left'
        : 'animate-slide-in-right';
    } else if (isSelected && selectedMoving) {
      // Selected card moves to center then drops
      animationClass = jobNumber === 1
        ? 'animate-move-center-drop-left'
        : 'animate-move-center-drop-right';
    } else if (isOther && rejectedFaded) {
      // Rejected card fades out
      animationClass = 'animate-fade-out';
    }

    return (
      <div className="relative w-full">
        <Card
          style={{ minHeight: '550px' }}
          className={`p-6 flex flex-col h-full ${animationClass} ${
            isSelected
              ? 'ring-4 ring-green-500 bg-green-50 shadow-2xl transition-[background-color,box-shadow,border-color] duration-300'
              : isOther
              ? 'transition-opacity duration-300'
              : 'hover:shadow-xl hover:border-gray-900 transition-[box-shadow,border-color] duration-300'
          }`}
        >
          {/* Selection Badge */}
          {isSelected && (
            <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full p-2 shadow-lg transition-transform duration-200 z-10">
              <Check className="w-6 h-6" />
            </div>
          )}

        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
          Option {jobNumber}
          {isSelected && (
            <span className="text-sm font-normal text-green-600">
              ✓ Selected
            </span>
          )}
        </h3>

        <div className="space-y-4 flex-1">
          <div>
            <p className="text-sm font-medium text-gray-600">Company</p>
            <p className="text-sm text-gray-900 mt-1 font-medium">{job.company_description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Company Size</p>
            <p className="text-sm text-gray-900 mt-1">{job.company_size}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Compensation</p>
            <p className="text-sm text-gray-900 mt-1 font-semibold">{job.compensation}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Location</p>
            <p className="text-sm text-gray-900 mt-1">{job.location}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">Diversity & Inclusion</p>
            <p className="text-sm text-gray-900 mt-1 italic">{job.dei_statement}</p>
          </div>
        </div>

        <Button
          onClick={() => handleSelect(jobNumber)}
          disabled={disabled || isSubmitting}
          className={`w-full mt-6 transition-all duration-300 ${
            isSelected
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900'
          }`}
          size="lg"
        >
          {isSelected ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Selected
            </span>
          ) : (
            `Select Option ${jobNumber}`
          )}
        </Button>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
        {renderJobCard(job1, 1)}
        {renderJobCard(job2, 2)}
      </div>
    </div>
  );
}
