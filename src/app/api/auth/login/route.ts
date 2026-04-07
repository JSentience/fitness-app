import { loginUser } from '@/lib/auth-api';
import { createAuthSuccessResponse, parseAuthCredentialsRequest } from '@/lib/auth-route';
import { createBadRequestResponse, createRouteErrorResponse } from '@/lib/route-response';

export async function POST(request: Request) {
  try {
    const { email, password } = await parseAuthCredentialsRequest(request);

    if (!email || !password) {
      return createBadRequestResponse('Введите email и пароль');
    }

    const { token } = await loginUser({ email, password });
    return await createAuthSuccessResponse(token, email);
  } catch (error) {
    return createRouteErrorResponse(error, 'Не удалось выполнить вход', 401);
  }
}
