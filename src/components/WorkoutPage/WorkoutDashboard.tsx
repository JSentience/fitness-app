import { ProfileSummary } from "./ProfileSummary";
import { CourseCard } from "./CourseCard";
import type { ProfileCourseState } from "./workout-page.types";

type WorkoutDashboardProps = {
  courseProgressMap: Record<string, number>;
  courses: ProfileCourseState[];
  coursesError: string;
  isAuthorized: boolean;
  isLoadingCourses: boolean;
  isLoadingWorkouts: boolean;
  onLogoutClickAction: () => void;
  onRemoveCourseAction: (courseId: string) => void;
  onSelectCourseAction: (course: ProfileCourseState["course"]) => void;
  profileEmail: string;
  profileName: string;
  workoutsError: string;
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
  workoutsError,
}: WorkoutDashboardProps) => {
  return (
    <div className="flex flex-col gap-15">
      <ProfileSummary
        profileName={profileName}
        profileEmail={profileEmail}
        onLogoutClickAction={onLogoutClickAction}
      />

      <section className="flex flex-col gap-10">
        <h2 className="text-[40px] font-semibold leading-[1.1] text-black">
          Мои курсы
        </h2>

        {!isAuthorized ? (
          <div className="rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
            <p className="text-[24px] leading-[1.1] text-black">
              Чтобы увидеть ваши курсы, авторизуйтесь.
            </p>
          </div>
        ) : isLoadingCourses ? (
          <div className="rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
            <p className="text-[24px] leading-[1.1] text-black/60">
              Загружаем ваши курсы...
            </p>
          </div>
        ) : coursesError ? (
          <div className="rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
            <p className="text-[24px] leading-[1.1] text-[#DB0030]">
              {coursesError}
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
            <p className="text-[24px] leading-[1.1] text-black">
              У вас пока нет добавленных курсов.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 md:justify-start">
            {courses.map(({ course, isRemoving, error }) => (
              <CourseCard
                key={course._id}
                course={course}
                progress={courseProgressMap[course._id] ?? 0}
                isRemoving={isRemoving}
                error={error}
                onSelectAction={onSelectCourseAction}
                onRemoveAction={onRemoveCourseAction}
              />
            ))}
          </div>
        )}

        {workoutsError && (
          <div className="rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
            <p className="text-[24px] leading-[1.1] text-[#DB0030]">
              {workoutsError}
            </p>
          </div>
        )}

        {isLoadingWorkouts && (
          <div className="rounded-[30px] bg-white p-7.5 shadow-[0px_4px_67px_-12px_rgba(0,0,0,0.13)]">
            <p className="text-[24px] leading-[1.1] text-black/60">
              Загружаем тренировки курса...
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
