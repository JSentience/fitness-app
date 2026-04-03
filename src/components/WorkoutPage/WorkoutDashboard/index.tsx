import { CourseCard } from '@/components/WorkoutPage/CourseCard';
import { DashboardNotice } from '@/components/WorkoutPage/DashboardNotice';
import { ProfileSummary } from '@/components/WorkoutPage/ProfileSummary';
import type { ProfileCourseState } from '@/components/WorkoutPage/workout-page.types';

type WorkoutDashboardProps = {
  courseProgressMap: Record<string, number>;
  courses: ProfileCourseState[];
  coursesError: string;
  isAuthorized: boolean;
  isLoadingCourses: boolean;
  isLoadingWorkouts: boolean;
  onLogoutClickAction: () => void;
  onRemoveCourseAction: (courseId: string) => void;
  onSelectCourseAction: (course: ProfileCourseState['course']) => void;
  profileEmail: string;
  profileName: string;
};

export const WorkoutDashboard = ({
  courseProgressMap,
  courses,
  coursesError,
  isAuthorized,
  isLoadingCourses,
  isLoadingWorkouts,
  onLogoutClickAction,
  onRemoveCourseAction,
  onSelectCourseAction,
  profileEmail,
  profileName,
}: WorkoutDashboardProps) => {
  return (
    <div className="flex flex-col gap-15">
      <ProfileSummary
        profileName={profileName}
        profileEmail={profileEmail}
        onLogoutClickAction={onLogoutClickAction}
      />

      <section className="flex flex-col gap-10">
        <h2 className="text-[40px] font-semibold leading-[1.1] text-black">Мои курсы</h2>

        {!isAuthorized ? (
          <DashboardNotice>Чтобы увидеть ваши курсы, авторизуйтесь.</DashboardNotice>
        ) : isLoadingCourses ? (
          <DashboardNotice tone="muted">Загружаем ваши курсы...</DashboardNotice>
        ) : coursesError ? (
          <DashboardNotice tone="danger">{coursesError}</DashboardNotice>
        ) : courses.length === 0 ? (
          <DashboardNotice>У вас пока нет добавленных курсов.</DashboardNotice>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 lg:justify-start">
            {courses.map(({ course, isRemoving }, index) => (
              <CourseCard
                key={course._id}
                course={course}
                imagePriority={index < 2}
                progress={courseProgressMap[course._id] ?? 0}
                isRemoving={isRemoving}
                onSelectAction={onSelectCourseAction}
                onRemoveAction={onRemoveCourseAction}
              />
            ))}
          </div>
        )}

        {isLoadingWorkouts && (
          <DashboardNotice tone="muted">Загружаем тренировки курса...</DashboardNotice>
        )}
      </section>
    </div>
  );
};
