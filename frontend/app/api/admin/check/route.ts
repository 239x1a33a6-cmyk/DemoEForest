import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebaseAdmin';

// POST or GET: verify Authorization: Bearer <idToken>
export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const idToken = authHeader.split(' ')[1];
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken);

    // check either custom claim 'admin' or env allowlist
    const isAdminClaim = !!decoded.admin;
    const allowlist = (process.env.ADMIN_UID_ALLOWLIST || '').split(',').map(s => s.trim()).filter(Boolean);
    const isAllowlist = allowlist.includes(decoded.uid);

    return NextResponse.json({ authenticated: true, uid: decoded.uid, admin: isAdminClaim || isAllowlist });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err?.message || String(err) }, { status: 401 });
  }
}
