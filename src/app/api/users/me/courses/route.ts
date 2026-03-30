import { getCurrentUser } from '@/lib/auth-api';
import { createUnauthorizedResponse, getAuthTokenFromCookies } from '@/lib/server-auth';
import { addUserCourse, ApiError } from '@/lib/user-courses-api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return createUnauthorizedResponse();
  }

  try {
    const body = (await request.json()) as { courseId?: string };
    const courseId = body.courseId?.trim() ?? '';

    if (!courseId) {
      return NextResponse.json({ message: 'Не указан идентификатор курса' }, { status: 400 });
    }

    const currentUser = await getCurrentUser(token);
    const selectedCourses = Array.isArray(currentUser.selectedCourses)
      ? currentUser.selectedCourses
      : [];

    if (selectedCourses.includes(courseId)) {
      return NextResponse.json({
        message: 'Курс уже добавлен',
        courseState: 'already-added' as const,
      });
    }

    const result = await addUserCourse(courseId, token);
    return NextResponse.json({
      message: result.message,
      courseState: 'added' as const,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Не удалось добавить курс',
      },
      { status: error instanceof ApiError ? error.status : 400 },
    );
  }
}
