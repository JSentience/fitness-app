import { getCurrentUser } from '@/lib/auth-api';
import {
  hasCourseId,
  isAlreadyAddedCourseErrorMessage,
  normalizeCourseId,
} from '@/lib/course-membership';
import { getErrorMessage } from '@/lib/error-utils';
import { createBadRequestResponse, createRouteErrorResponse } from '@/lib/route-response';
import { requireAuthToken } from '@/lib/server-auth';
import { addUserCourse } from '@/lib/user-courses-api';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const auth = await requireAuthToken();

  if ('response' in auth) {
    return auth.response;
  }

  try {
    const body = (await request.json()) as { courseId?: string };
    const courseId = normalizeCourseId(body.courseId ?? '');

    if (!courseId) {
      return createBadRequestResponse('Не указан идентификатор курса');
    }

    const currentUser = await getCurrentUser(auth.token);
    const selectedCourses = Array.isArray(currentUser.selectedCourses)
      ? currentUser.selectedCourses
      : [];

    if (hasCourseId(selectedCourses, courseId)) {
      return NextResponse.json({
        message: 'Курс уже добавлен',
        courseState: 'already-added' as const,
      });
    }

    const result = await addUserCourse(courseId, auth.token);
    return NextResponse.json({
      message: result.message,
      courseState: 'added' as const,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error, 'Не удалось добавить курс');

    if (isAlreadyAddedCourseErrorMessage(errorMessage)) {
      return NextResponse.json({
        message: errorMessage,
        courseState: 'already-added' as const,
      });
    }

    return createRouteErrorResponse(error, 'Не удалось добавить курс', 400);
  }
}
