import { memo } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { MapPin, Clock, Award } from 'lucide-react';
import { AdvocateResult } from '@/app/types';

interface AdvocateCardProps {
  advocate: AdvocateResult;
  onSelect: (advocate: AdvocateResult) => void;
}

export const AdvocateCard = memo(function AdvocateCard({ advocate, onSelect }: AdvocateCardProps) {
  return (
    <Card
      onClick={() => onSelect(advocate)}
      className="p-6 relative cursor-pointer hover:shadow-lg transition-shadow border-0"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-3">{advocate.firstName} {advocate.lastName}</h3>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-500" />
          {advocate.city}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-green-500" />
          {advocate.yearsOfExperience} years experience
        </div>
        <div className="flex items-center gap-2">
          <Award size={16} className="text-purple-500" />
          {advocate.degree}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Specializations</p>
        <div className="flex flex-wrap gap-1 mb-8">
          {advocate.specialties.map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-80 rounded-lg absolute bottom-4 left-0 right-0 mx-auto"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(advocate);
        }}
      >
        View Profile
      </Button>
    </Card>
  );
});
