export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const healthConcernsParam = searchParams.get('healthConcerns') || '';
  const city = searchParams.get('city') || '';

  const advocates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      city: 'New York, NY',
      experience: 8,
      education: 'MSW',
      specializations: ['Mental Health', 'Anxiety', 'Depression'],
      phone: '(555) 123-4567',
      email: 'sarah.johnson@advocates.com',
      background: 'Sarah is a licensed clinical social worker with 8 years of experience in mental health advocacy. She specializes in helping patients navigate anxiety and depression treatment options.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      city: 'San Francisco, CA',
      experience: 12,
      education: 'MD',
      specializations: ['Chronic Pain', 'Heart Disease', 'Diabetes'],
      phone: '(555) 234-5678',
      email: 'michael.chen@advocates.com',
      background: 'Dr. Chen is a board-certified internal medicine physician with over 12 years of patient advocacy experience. He helps patients with complex medical conditions coordinate their care.',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      city: 'Austin, TX',
      experience: 6,
      education: 'BSc',
      specializations: ['Cancer Support', 'Mental Health'],
      phone: '(555) 345-6789',
      email: 'emma.rodriguez@advocates.com',
      background: 'Emma is a compassionate cancer support advocate who has helped dozens of patients and families navigate treatment decisions and emotional challenges.',
    },
    {
      id: 4,
      name: 'James Williams',
      city: 'Boston, MA',
      experience: 10,
      education: 'MSW',
      specializations: ['Arthritis', 'Chronic Pain', 'Mental Health'],
      phone: '(555) 456-7890',
      email: 'james.williams@advocates.com',
      background: 'James combines his background in social work with personal experience managing chronic conditions to provide empathetic, informed advocacy.',
    },
    {
      id: 5,
      name: 'Lisa Park',
      city: 'Seattle, WA',
      experience: 9,
      education: 'MD',
      specializations: ['Heart Disease', 'Diabetes'],
      phone: '(555) 567-8901',
      email: 'lisa.park@advocates.com',
      background: 'Dr. Park specializes in cardiovascular and endocrine advocacy, helping patients understand complex treatment options and lifestyle modifications.',
    },
    {
      id: 6,
      name: 'David Thompson',
      city: 'Denver, CO',
      experience: 7,
      education: 'BSc',
      specializations: ['Mental Health', 'Anxiety', 'Depression'],
      phone: '(555) 678-9012',
      email: 'david.thompson@advocates.com',
      background: 'David is a wellness advocate with a passion for mental health support and helping patients build resilience.',
    },
  ];

  const healthConcernsArray = healthConcernsParam ? healthConcernsParam.split(',') : [];
  
  let filtered = advocates.filter((advocate) => {
    // Filter by city if provided
    if (city && !advocate.city.toLowerCase().includes(city.toLowerCase())) {
      return false;
    }
    
    // Filter by health concerns if provided - must match at least one specialization
    if (healthConcernsArray.length > 0) {
      const hasMatchingConcern = healthConcernsArray.some((concern) =>
        advocate.specializations.some((spec) =>
          spec.toLowerCase().includes(concern.toLowerCase())
        )
      );
      if (!hasMatchingConcern) return false;
    }
    
    // Filter by name search if provided
    if (query && !advocate.name.toLowerCase().includes(query)) {
      return false;
    }
    
    return true;
  });

  return Response.json({ advocates: filtered });
}
