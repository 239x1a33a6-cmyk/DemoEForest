import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { state: string } }
) {
  const state = params.state;

  // Mock metadata database
  const metadata: { [key: string]: any } = {
    'jh': {
      state_name: "Jharkhand",
      area_sqkm: 79714,
      fra_holders: 12850,
      district_count: 24
    },
    'mp': {
      state_name: "Madhya Pradesh",
      area_sqkm: 308252,
      fra_holders: 25720,
      district_count: 52
    },
    'or': {
      state_name: "Odisha",
      area_sqkm: 155707,
      fra_holders: 18450,
      district_count: 30
    }
  };

  const data = metadata[state.toLowerCase()];

  if (data) {
    return NextResponse.json(data);
  } else {
    return NextResponse.json({ error: 'State not found' }, { status: 404 });
  }
}
