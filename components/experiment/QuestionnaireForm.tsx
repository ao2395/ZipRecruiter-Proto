'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { WorkPreference, SalaryRange, type ParticipantCreate } from '@/lib/types';

interface QuestionnaireFormProps {
  onSubmit: (data: ParticipantCreate) => void;
  isSubmitting?: boolean;
}

export function QuestionnaireForm({ onSubmit, isSubmitting = false }: QuestionnaireFormProps) {
  const [formData, setFormData] = useState<ParticipantCreate>({
    email: '',
    name: '',
    zip_code: '',
    position: '',
    work_preference: WorkPreference.NO_PREFERENCE,
    salary_range: SalaryRange.FLEXIBLE,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.zip_code || !/^\d{5}$/.test(formData.zip_code)) {
      newErrors.zip_code = 'Please enter a valid 5-digit ZIP code';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const updateField = (field: keyof ParticipantCreate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Let's get started!
          </h2>
          <p className="text-gray-600">
            Please answer a few quick questions about the kind of roles you're looking for.
          </p>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="your.email@example.com"
            className={errors.email ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="John Doe"
            className={errors.name ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* ZIP Code */}
        <div>
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            type="text"
            value={formData.zip_code}
            onChange={(e) => updateField('zip_code', e.target.value)}
            placeholder="12345"
            maxLength={5}
            className={errors.zip_code ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.zip_code && (
            <p className="text-sm text-red-500 mt-1">{errors.zip_code}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <Label htmlFor="position">Desired Position</Label>
          <Input
            id="position"
            type="text"
            value={formData.position}
            onChange={(e) => updateField('position', e.target.value)}
            placeholder="e.g., Marketing Manager in tech"
            className={errors.position ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.position && (
            <p className="text-sm text-red-500 mt-1">{errors.position}</p>
          )}
        </div>

        {/* Work Preference */}
        <div>
          <Label htmlFor="work_preference">Work Preference</Label>
          <div className="space-y-2 mt-2">
            {Object.values(WorkPreference).map((pref) => (
              <label key={pref} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="work_preference"
                  value={pref}
                  checked={formData.work_preference === pref}
                  onChange={(e) => updateField('work_preference', e.target.value)}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span className="text-sm">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <Label htmlFor="salary_range">Salary Range</Label>
          <select
            id="salary_range"
            value={formData.salary_range}
            onChange={(e) => updateField('salary_range', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {Object.values(SalaryRange).map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </Button>
      </form>
    </Card>
  );
}
