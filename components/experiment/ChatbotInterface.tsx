'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import type { ParticipantCreate, WorkPreference, SalaryRange } from '@/lib/types';

interface ChatbotInterfaceProps {
  onComplete: (data: ParticipantCreate) => void;
}

interface Message {
  type: 'bot' | 'user';
  content: string;
}

export function ChatbotInterface({ onComplete }: ChatbotInterfaceProps) {
  const questions = [
    {
      id: 'email',
      question: "First, could you confirm your email address? We'll use this to send you personalized job recommendations.",
      type: 'email' as const,
      validate: (value: string) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return null;
      },
    },
    {
      id: 'name',
      question: "Great! And what's your name?",
      type: 'text' as const,
      validate: (value: string) => {
        if (!value || value.trim().length === 0) return 'Name is required';
        return null;
      },
    },
    {
      id: 'zip_code',
      question: "What's your ZIP code? This helps us find jobs in your area.",
      type: 'text' as const,
      validate: (value: string) => {
        if (!value) return 'ZIP code is required';
        if (!/^\d{5}$/.test(value)) return 'Please enter a valid 5-digit ZIP code';
        return null;
      },
    },
    {
      id: 'position',
      question: "What type of position are you looking for? (e.g., Software Engineer, Marketing Manager)",
      type: 'text' as const,
      validate: (value: string) => {
        if (!value || value.trim().length === 0) return 'Position is required';
        return null;
      },
    },
    {
      id: 'work_preference',
      question: "Do you have a preference for where you work?",
      type: 'radio' as const,
      options: [
        { label: 'Remote', value: 'Remote' },
        { label: 'Hybrid', value: 'Hybrid' },
        { label: 'In-person', value: 'In-person' },
        { label: 'No preference', value: 'No strong preference' },
      ],
      validate: (value: string) => {
        if (!value) return 'Please select a work preference';
        return null;
      },
    },
    {
      id: 'salary_range',
      question: "Finally, what's your desired salary range?",
      type: 'select' as const,
      options: [
        { label: 'Below $50,000', value: 'Below $50,000' },
        { label: '$50,000 - $75,000', value: '$50,000 - $75,000' },
        { label: '$75,000 - $100,000', value: '$75,000 - $100,000' },
        { label: '$100,000 - $150,000', value: '$100,000 - $150,000' },
        { label: '$150,000+', value: '$150,000+' },
        { label: "I'm flexible", value: "I'm flexible" },
      ],
      validate: (value: string) => {
        if (!value) return 'Please select a salary range';
        return null;
      },
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hi! I’m [Assistant Name], the AI assistant for [Company Name]. I’ll ask you a few quick questions about the kind of roles and employers you’re looking for, which should take about three minutes. Based on your answers, I’ll be able to help identify roles that will be well suited to what you are looking for. Let’s get started. ",
    },
    {
      type: 'bot',
      content: questions[0].question,
    },
  ]);

  const [formData, setFormData] = useState<Partial<ParticipantCreate>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [completedFormData, setCompletedFormData] = useState<ParticipantCreate | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAnswer = (value: string) => {
    const question = questions[currentQuestion];

    // Validate input
    const validationError = question.validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');

    // Hide input immediately to prevent flickering
    setShowInput(false);

    // Update form data first
    const updatedFormData = {
      ...formData,
      [question.id]: value,
    };
    setFormData(updatedFormData);
    setCurrentInput('');

    // Add user message
    setMessages((prev) => [...prev, {
      type: 'user',
      content: value,
    }]);

    // Move to next question or complete
    if (currentQuestion < questions.length - 1) {
      // Show typing indicator
      setTimeout(() => {
        setIsTyping(true);
      }, 300);

      setTimeout(() => {
        setIsTyping(false);
        const nextQuestion = questions[currentQuestion + 1];
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: nextQuestion.question,
          },
        ]);
        setCurrentQuestion(currentQuestion + 1);
        setShowInput(true); // Show input for next question
      }, 800);
    } else {
      // All questions answered - complete questionnaire
      setTimeout(() => {
        setIsTyping(true);
      }, 300);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            type: 'bot',
            content: "Perfect! Now let's show you some job opportunities. I'll present pairs of jobs - just pick the one you prefer!",
          },
        ]);

        // Show the "Next Step" button instead of auto-submitting
        setIsComplete(true);
        setCompletedFormData(updatedFormData as ParticipantCreate);
      }, 800);
    }
  };

  const handleNextStep = () => {
    if (completedFormData) {
      onComplete(completedFormData);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleAnswer(currentInput.trim());
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex flex-col h-[700px] max-w-3xl mx-auto border rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xl"></span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">ZipRecruiter Assistant</h2>
            <p className="text-xs text-gray-300">Online</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/50">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md transition-all hover:shadow-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-gray-900 to-black text-white rounded-br-sm'
                  : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-sm px-5 py-3 shadow-md border border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Next Step Button */}
      {isComplete && (
        <div className="border-t border-gray-200 p-5 bg-white shadow-inner flex justify-center">
          <Button
            onClick={handleNextStep}
            size="lg"
            className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 rounded-xl px-8 py-6 text-base font-semibold transition-all transform hover:scale-105"
          >
            Next Step →
          </Button>
        </div>
      )}

      {/* Input area */}
      {currentQuestion < questions.length && showInput && !isComplete && (
        <div className="border-t border-gray-200 p-5 bg-white shadow-inner">
          {error && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {currentQ.type === 'text' || currentQ.type === 'email' ? (
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <Input
                type={currentQ.type === 'email' ? 'email' : 'text'}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 border-2 border-gray-200 focus:border-gray-900 rounded-xl px-4 py-3 transition-all"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!currentInput.trim()}
                className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 rounded-xl px-6 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                Send
              </Button>
            </form>
          ) : currentQ.type === 'radio' && currentQ.options ? (
            <div className="space-y-2">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-left px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all transform hover:scale-102 active:scale-98 bg-white"
                >
                  <span className="font-medium text-gray-900">{option.label}</span>
                </button>
              ))}
            </div>
          ) : currentQ.type === 'select' && currentQ.options ? (
            <div className="space-y-2">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-left px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all transform hover:scale-102 active:scale-98 bg-white"
                >
                  <span className="font-medium text-gray-900">{option.label}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
