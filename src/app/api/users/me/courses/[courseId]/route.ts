import { getCurrentUser } from '@/lib/auth-api';
import {
    hasCourseId,
    isNotAddedCourseErrorMessage,
    normalizeCourseId,
} from '@/lib/course-membership';
import { getErrorMessage } from '@/lib/error-utils';
import {
    createBadRequestResponse,
    createRouteErrorResponse,
    type RouteContext,
} from '@/lib/route-response';
import { requireAuthToken } from '@/lib/server-auth';
import { removeUserCourse } from '@/lib/user-courses-api';
import { NextResponse } from 'next/server';

export async function DELETE(_: Request, { params }: RouteContext<{ courseId: string }>) {
  const auth = await requireAuthToken();

  if ('response' in auth) {
    return auth.response;
  }

  try {
    const { courseId } = await params;
    const normalizedCourseId = normalizeCourseId(courseId);

    if (!normalizedCourseId) {
      return createBadRequestResponse('Не указан идентификатор курса');
    }

    const currentUser = await getCurrentUser(auth.token);
    const selectedCourses = Array.isArray(currentUser.selectedCourses)
      ? currentUser.selectedCourses
      : [];

    if (!hasCourseId(selectedCourses, normalizedCourseId)) {
      return NextResponse.json({
        message: 'Курс не был добавлен',
        courseState: 'not-added' as const,
      });
    }

    const result = await removeUserCourse(normalizedCourseId, auth.token);
    return NextResponse.json({
      message: result.message,
      courseState: 'removed' as const,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Не удалось удалить курс');

    if (isNotAddedCourseErrorMessage(errorMessage)) {
      return NextResponse.json({
        message: errorMessage,
        courseState: 'not-added' as const,
      });
    }

    return createRouteErrorResponse(error, 'Не удалось удалить курс', 400);
  }
}
