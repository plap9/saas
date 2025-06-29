import React, { useState } from 'react';
import { Button, Card, Input } from '../ui';
import { cn } from '../../utils/cn';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
}

interface OnboardingStepProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  data: any;
  setData: (data: any) => void;
}

// Step 1: Personal Information
const PersonalInfoStep: React.FC<OnboardingStepProps> = ({ onNext, data, setData }) => {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData({ ...data, ...formData });
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
        <p className="text-white/70 text-sm">Let's start with your basic details</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="floating-input-group">
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder=" "
            required
            className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-purple-400 focus:ring-purple-400/50"
          />
          <label className="floating-label text-white/70">First Name</label>
        </div>

        <div className="floating-input-group">
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder=" "
            required
            className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-purple-400 focus:ring-purple-400/50"
          />
          <label className="floating-label text-white/70">Last Name</label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full btn-modern bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        Continue
      </Button>
    </form>
  );
};

// Step 2: Role & Industry
const RoleSelectionStep: React.FC<OnboardingStepProps> = ({ onNext, onBack, data, setData }) => {
  const [selectedRole, setSelectedRole] = useState(data.role || '');
  const [industry, setIndustry] = useState(data.industry || '');

  const roles = [
    { id: 'business', label: 'Business Professional', icon: '💼' },
    { id: 'creator', label: 'Content Creator', icon: '🎨' },
    { id: 'developer', label: 'Developer', icon: '💻' },
    { id: 'business-owner', label: 'Small Business Owner', icon: '🏢' },
    { id: 'student', label: 'Student', icon: '🎓' },
    { id: 'other', label: 'Other', icon: '🌟' },
  ];

  const handleSubmit = () => {
    if (selectedRole) {
      setData({ ...data, role: selectedRole, industry });
      onNext({ role: selectedRole, industry });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Your Work</h3>
        <p className="text-white/70 text-sm">Help us personalize your experience</p>
      </div>

      <div>
        <label className="block text-white/80 font-medium mb-3">What's your role?</label>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role.id)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all duration-200 text-left',
                selectedRole === role.id
                  ? 'border-purple-400 bg-purple-400/20 text-white'
                  : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
              )}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{role.icon}</span>
                <span className="font-medium">{role.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="floating-input-group">
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="floating-input bg-white/10 border-white/20 text-white focus:border-purple-400 focus:ring-purple-400/50 w-full rounded-xl px-4 py-3"
        >
          <option value="">Select Industry</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl py-4 transition-all duration-300"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedRole}
          className="flex-1 btn-modern bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

// Step 3: AI Personality Selection
const AIPersonalityStep: React.FC<OnboardingStepProps> = ({ onNext, onBack, data, setData }) => {
  const [selectedPersonality, setSelectedPersonality] = useState(data.personality || '');

  const personalities = [
    {
      id: 'professional',
      title: 'Professional & Focused',
      description: 'Direct, efficient responses',
      preview: 'Here are 3 key points to consider...',
      icon: '🎯',
    },
    {
      id: 'creative',
      title: 'Creative & Inspiring',
      description: 'Imaginative, encouraging tone',
      preview: 'Let\'s explore some exciting possibilities...',
      icon: '🎨',
    },
    {
      id: 'casual',
      title: 'Casual & Friendly',
      description: 'Conversational, approachable',
      preview: 'Hey! I\'d love to help you with that...',
      icon: '🤝',
    },
  ];

  const handleSubmit = () => {
    if (selectedPersonality) {
      setData({ ...data, personality: selectedPersonality });
      onNext({ personality: selectedPersonality });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Choose Your AI Style</h3>
        <p className="text-white/70 text-sm">How should I communicate with you?</p>
      </div>

      <div className="space-y-4">
        {personalities.map((personality) => (
          <button
            key={personality.id}
            type="button"
            onClick={() => setSelectedPersonality(personality.id)}
            className={cn(
              'w-full p-6 rounded-xl border-2 transition-all duration-200 text-left',
              selectedPersonality === personality.id
                ? 'border-purple-400 bg-purple-400/20'
                : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
            )}
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">{personality.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-white mb-1">{personality.title}</h4>
                <p className="text-white/70 text-sm mb-2">{personality.description}</p>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-white/80 text-sm italic">"{personality.preview}"</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onBack}
          className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl py-4 transition-all duration-300"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedPersonality}
          className="flex-1 btn-modern bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

// Main Onboarding Flow Component
const OnboardingFlow: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Tell us about yourself',
      component: PersonalInfoStep,
    },
    {
      id: 2,
      title: 'Your Work',
      description: 'Help us understand your role',
      component: RoleSelectionStep,
    },
    {
      id: 3,
      title: 'AI Personality',
      description: 'Choose your communication style',
      component: AIPersonalityStep,
    },
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const StepComponent = currentStepData?.component;

  const handleNext = (stepData?: any) => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ ...userData, ...stepData });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
            step.id === currentStep 
              ? 'bg-purple-500 text-white shadow-lg' 
              : step.id < currentStep 
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white/60'
          )}>
            {step.id < currentStep ? '✓' : step.id}
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              'w-12 h-1 mx-2 transition-all',
              step.id < currentStep ? 'bg-green-500' : 'bg-white/20'
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="auth-glass-card hover-lift max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Welcome to AI Assistant
        </h2>
        <p className="text-white/80">
          Let's personalize your experience in just a few steps
        </p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      {StepComponent && (
        <StepComponent
          onNext={handleNext}
          onBack={handleBack}
          data={userData}
          setData={setUserData}
        />
      )}
    </div>
  );
};

export default OnboardingFlow;