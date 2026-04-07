import { createLogoutResponse } from '@/lib/auth-route';

export async function POST() {
  return createLogoutResponse();
}
