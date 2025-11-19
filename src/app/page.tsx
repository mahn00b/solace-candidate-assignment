'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge, Input, Loader, SimpleDialog, SimpleDialogHeader, SimpleDialogTitle } from '@/components/ui';
import { AdvocateCard } from '@/components/advocate-card';
import { Search, MapPin, Clock, Award } from 'lucide-react';
import CityAutocomplete from '@/components/city-autocomplete';
import { HealthConcern, AdvocateResult } from './types';

export default function Page() {
  const [step, setStep] = useState(0);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<number | null>(null);
  const [educationFilter, setEducationFilter] = useState<string | null>(null);
  const [selectedAdvocate, setSelectedAdvocate] = useState<AdvocateResult | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // State for health concerns
  const [healthConcerns, setHealthConcerns] = useState<HealthConcern[]>([]);
  const [isLoadingConcerns, setIsLoadingConcerns] = useState(false);

  // State for advocates
  const [advocates, setAdvocates] = useState<AdvocateResult[]>([]);
  const [isLoadingAdvocates, setIsLoadingAdvocates] = useState(false);

    const handleSelectAdvocate = useCallback((advocate: AdvocateResult) => {
    setSelectedAdvocate(advocate);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    // Delay clearing the advocate data until after dialog is closed
    setTimeout(() => setSelectedAdvocate(null), 150);
  }, []);

  // Fetch health concerns on mount
  useEffect(() => {
    const fetchHealthConcerns = async () => {
      setIsLoadingConcerns(true);
      try {
        const response = await fetch('/api/health-concerns');
        const data = await response.json();
        setHealthConcerns(data.concerns || []);
      } catch (error) {
        console.error('Failed to fetch health concerns:', error);
      } finally {
        setIsLoadingConcerns(false);
      }
    };

    fetchHealthConcerns();
  }, []);

  // Fetch advocates when city, concerns, or step changes
  useEffect(() => {
    const shouldFetch = selectedCity && selectedConcerns.length > 0 && step === 3;

    if (!shouldFetch) {
      setAdvocates([]);
      return;
    }

    const fetchAdvocates = async () => {
      setIsLoadingAdvocates(true);
      try {
        const params = new URLSearchParams({
          city: selectedCity,
          healthConcerns: selectedConcerns.join(','),
        });

        const response = await fetch(`/api/advocates?${params}`);
        const data = await response.json();
        setAdvocates(data.advocates || []);
      } catch (error) {
        console.error('Failed to fetch advocates:', error);
        setAdvocates([]);
      } finally {
        setIsLoadingAdvocates(false);
      }
    };

    fetchAdvocates();
  }, [selectedCity, selectedConcerns, step]);
  // Filter advocates based on search, experience, and education
  const filteredAdvocates = advocates.filter((advocate) => {
    // Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
      if (!fullName.includes(query)) return false;
    }

    // Experience Filter
    if (experienceFilter !== null) {
      if (advocate.yearsOfExperience < experienceFilter) return false;
    }

    // Education Filter
    if (educationFilter) {
      if (advocate.degree !== educationFilter) return false;
    }

    return true;
  });

  const handleGetStarted = () => setStep(1);

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleConcernsNext = () => setStep(2);

  const handleLocationNext = () => {
    setStep(3);
    // Reset filters when moving to results
    setSearchQuery('');
    setExperienceFilter(null);
    setEducationFilter(null);
  };

  // Step 0: Intro
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 border-0 shadow-lg">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
              <p className="text-lg text-gray-600">
                Find the right health advocate for your needs
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              Our network of certified health advocates is here to support you on your wellness journey.
            </p>
            <Button onClick={handleGetStarted} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 1: Health Concerns
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Health Concerns</h1>
            <p className="text-gray-600">Choose one or more areas that match your needs</p>
          </div>

          <div className="max-h-[calc(100vh-280px)] pr-2 scrollbar-visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {isLoadingConcerns ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <Loader size="lg" className="text-blue-600 mb-4" />
                  <p className="text-gray-600">Loading health concerns...</p>
                </div>
              ) : (
                healthConcerns.map((concern: HealthConcern) => (
                  <button
                    key={concern.id}
                    onClick={() => toggleConcern(concern.name)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left font-medium ${
                      selectedConcerns.includes(concern.name)
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-blue-300'
                    }`}
                  >
                    {concern.name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Fixed footer buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(0)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleConcernsNext}
              disabled={selectedConcerns.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Location
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Your Location</h1>
            <p className="text-gray-600">This helps us find advocates near you</p>
          </div>

          <Card className="p-6 border-0 shadow-md mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
            <CityAutocomplete value={selectedCity} onChange={setSelectedCity} />
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleLocationNext}
              disabled={!selectedCity}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Search & Filter
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Find Your Health Advocate</h1>
          <p className="text-gray-600">
            Showing advocates for: <span className="font-semibold text-blue-600">{selectedConcerns.join(', ')}</span> in <span className="font-semibold text-blue-600">{selectedCity}</span>
          </p>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Search by advocate name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
          </div>

          {/* Experience Filter */}
          <select
            value={experienceFilter || ''}
            onChange={(e) => setExperienceFilter(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Years of Experience</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
            <option value="15">15+ years</option>
          </select>

          {/* Education Filter */}
          <select
            value={educationFilter || ''}
            onChange={(e) => setEducationFilter(e.target.value || null)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Education Level</option>
            <option value="BSc">BSc</option>
            <option value="MSW">MSW</option>
            <option value="MD">MD</option>
          </select>
        </div>

        {/* Advocates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoadingAdvocates ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Loader size="lg" className="text-blue-600 mb-4" />
              <p className="text-gray-600">Loading advocates...</p>
            </div>
          ) : filteredAdvocates.length > 0 ? (
            filteredAdvocates.map((advocate: AdvocateResult) => (
              <AdvocateCard
                key={advocate.id}
                advocate={advocate}
                onSelect={handleSelectAdvocate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No advocates match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Simplified custom dialog */}
      <SimpleDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        className="max-w-2xl"
      >
        {selectedAdvocate && (
          <>
            <SimpleDialogHeader>
              <SimpleDialogTitle>{selectedAdvocate.firstName}&nbsp;{selectedAdvocate.lastName}</SimpleDialogTitle>
            </SimpleDialogHeader>

            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Phone</p>
                  <p className="text-gray-900">{selectedAdvocate.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Email</p>
                  <p className="text-gray-900">{selectedAdvocate.email}</p>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAdvocate.specialties.map((spec) => (
                    <Badge key={spec} className="bg-blue-100 text-blue-800">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Background */}
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Background</p>
                <p className="text-gray-700 leading-relaxed">{selectedAdvocate.background}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={handleCloseDialog} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Message Advocate</Button>
              </div>
            </div>
          </>
        )}
      </SimpleDialog>
    </div>
  );
}
