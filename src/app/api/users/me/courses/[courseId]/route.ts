import { getCurrentUser } from '@/lib/auth-api';
import { createUnauthorizedResponse, getAuthTokenFromCookies } from '@/lib/server-auth';
import { ApiError, removeUserCourse } from '@/lib/user-courses-api';
import { NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    courseId: string;
  }>;
};

export async function DELETE(_: Request, { params }: RouteContext) {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return createUnauthorizedResponse();
  }

  try {
    const { courseId } = await params;
    const normalizedCourseId = courseId.trim();

    if (!normalizedCourseId) {
      return NextResponse.json({ message: 'Не указан идентификатор курса' }, { status: 400 });
    }

    const currentUser = await getCurrentUser(token);
    const selectedCourses = Array.isArray(currentUser.selectedCourses)
      ? currentUser.selectedCourses
      : [];

    if (!selectedCourses.includes(normalizedCourseId)) {
      return NextResponse.json({
        message: 'Курс не был добавлен',
        courseState: 'not-added' as const,
      });
    }

    const result = await removeUserCourse(normalizedCourseId, token);
    return NextResponse.json({
      message: result.message,
      courseState: 'removed' as const,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Не удалось удалить курс',
      },
      { status: error instanceof ApiError ? error.status : 400 },
    );
  }
}
