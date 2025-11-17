'use client';

import { useState, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CityAutocompleteProps {
  value: string;
  onChange: (city: string) => void;
}

export function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
  const { data: citiesData } = useSWR('/api/cities', fetcher);
  const US_CITIES = citiesData?.cities || [];

  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const results = US_CITIES.filter((city: string) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(results);
      setOpen(true);
    } else {
      setFiltered([]);
      setOpen(false);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    onChange(city);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        ref={inputRef}
        placeholder="Enter your city"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value && setOpen(true)}
        className="rounded-xl"
      />

      {open && filtered.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 border-0 shadow-lg z-50 p-0 max-h-64 overflow-y-auto">
          {filtered.map((city) => (
            <button
              key={city}
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2 text-gray-900"
            >
              <MapPin size={16} className="text-blue-500 flex-shrink-0" />
              {city}
            </button>
          ))}
        </Card>
      )}

      {open && value && filtered.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 border-0 shadow-lg z-50 p-4 text-center text-gray-500">
          No cities found matching  &quot;{value}&quot;
        </Card>
      )}
    </div>
  );
}

export default CityAutocomplete;
