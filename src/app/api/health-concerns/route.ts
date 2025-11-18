export async function GET() {
  const concerns = [
    'Mental Health',
    'Chronic Pain',
    'Diabetes',
    'Heart Disease',
    'Cancer Support',
    'Anxiety',
    'Depression',
    'Arthritis',
  ];

  return Response.json({ concerns });
}
