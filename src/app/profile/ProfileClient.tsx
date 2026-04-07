'use client';

import { useShallow } from 'zustand/react/shallow';

import { SelectWorkoutModal } from '@/components/SelectWorkoutModal/SelectWorkoutModal';
import { WorkoutDashboard } from '@/components/WorkoutPage/WorkoutDashboard';
import { useWorkoutCourses } from '@/components/WorkoutPage/hooks/useWorkoutCourses';
import { useWorkoutSelectionModal } from '@/components/WorkoutPage/hooks/useWorkoutSelectionModal';
import { useAuthStore } from '@/store/auth.store';

export const ProfileClient = () => {
  const { isAuthorized, user, selectedCourses, setSelectedCourses, logout } = useAuthStore(
    useShallow((state) => ({
      isAuthorized: state.isAuthorized,
      user: state.user,
      selectedCourses: state.selectedCourses,
      setSelectedCourses: state.setSelectedCourses,
      logout: state.logout,
    })),
  );

  const {
    courseProgressMap,
    courses,
    coursesError,
    isLoadingCourses,
    loadCourseWorkouts,
    removeCourse,
  } = useWorkoutCourses({
    selectedCourseIds: selectedCourses,
    isAuthorized,
    onSelectedCoursesChange: setSelectedCourses,
  });

  const {
    closeWorkoutSelection,
    completedWorkoutIds,
    isLoadingWorkouts,
    isSelectModalOpen,
    openWorkoutSelection,
    selectModalCourseName,
    selectModalWorkouts,
    startSelectedWorkout,
  } = useWorkoutSelectionModal({
    loadCourseWorkoutsAction: loadCourseWorkouts,
  });

  return (
    <main className="min-h-screen bg-white px-4 py-12.5 md:px-35">
      <WorkoutDashboard
        courseProgressMap={courseProgressMap}
        courses={courses}
        coursesError={coursesError}
        isAuthorized={isAuthorized}
        isLoadingCourses={isLoadingCourses}
        isLoadingWorkouts={isLoadingWorkouts}
        onLogoutClickAction={() => {
          void logout();
        }}
        onRemoveCourseAction={(courseId) => {
          void removeCourse(courseId);
        }}
        onSelectCourseAction={(course) => {
          void openWorkoutSelection(course);
        }}
        profileEmail={user?.email ?? ''}
        profileName={user?.name ?? 'Пользователь'}
      />

      <SelectWorkoutModal
        isOpen={isSelectModalOpen}
        courseName={selectModalCourseName}
        workouts={selectModalWorkouts}
        completedWorkoutIds={completedWorkoutIds}
        onCloseAction={closeWorkoutSelection}
        onStartAction={startSelectedWorkout}
      />
    </main>
  );
};
