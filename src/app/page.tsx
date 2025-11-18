'use client';

import { useState } from 'react';
import { Card, Button, Badge, Input, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { Search, MapPin, Clock, Award } from 'lucide-react';
import useSWR from 'swr';
import CityAutocomplete from '@/components/city-autocomplete';

interface Advocate {
  id: string;
  name: string;
  city: string;
  experience: number;
  education: string;
  phone: string;
  email: string;
  specializations: string[];
  background: string;
}

interface HealthConcern {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Page() {
  const [step, setStep] = useState(0);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<number | null>(null);
  const [educationFilter, setEducationFilter] = useState<string | null>(null);
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate | null>(null);

  // Fetch health concerns
  const { data: healthConcernsData } = useSWR('/api/health-concerns', fetcher);
  const HEALTH_CONCERNS = healthConcernsData?.concerns || [];

  // Fetch advocates only when both city and health concerns are selected
  const shouldFetchAdvocates = selectedCity && selectedConcerns.length > 0 && step === 3;
  const advocateQuery = new URLSearchParams({
    city: selectedCity,
    healthConcerns: selectedConcerns.join(','),
  }).toString();

  const { data: advocatesData } = useSWR(
    shouldFetchAdvocates ? `/api/advocates?${advocateQuery}` : null,
    fetcher
  );

  const advocates = advocatesData?.advocates || [];

  // Filter advocates based on client-side filters
  const filteredAdvocates = advocates.filter((advocate: Advocate) => {
    const matchesSearch = advocate.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExperience = experienceFilter ? advocate.experience >= experienceFilter : true;
    const matchesEducation = educationFilter ? advocate.education === educationFilter : true;
    return matchesSearch && matchesExperience && matchesEducation;
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
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your Health Concerns</h1>
            <p className="text-gray-600">Choose one or more areas that match your needs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {HEALTH_CONCERNS.map((concern: HealthConcern) => (
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
            ))}
          </div>

          <div className="flex gap-3">
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
          {filteredAdvocates.length > 0 ? (
            filteredAdvocates.map((advocate) => (
              <Card
                key={advocate.id}
                onClick={() => setSelectedAdvocate(advocate)}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-0"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{advocate.name}</h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    {advocate.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-green-500" />
                    {advocate.experience} years experience
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-purple-500" />
                    {advocate.education}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {advocate.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full rounded-lg">
                  View Profile
                </Button>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No advocates match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedAdvocate} onOpenChange={() => setSelectedAdvocate(null)}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedAdvocate?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">Phone</p>
                <p className="text-gray-900">{selectedAdvocate?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-gray-900">{selectedAdvocate?.email}</p>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {selectedAdvocate?.specializations.map((spec) => (
                  <Badge key={spec} className="bg-blue-100 text-blue-800">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Background */}
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Background</p>
              <p className="text-gray-700 leading-relaxed">{selectedAdvocate?.background}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setSelectedAdvocate(null)} className="flex-1">
                Close
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Message Advocate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
