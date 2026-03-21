"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { SelectWorkoutModal } from "@/components/SelectWorkoutModal/SelectWorkoutModal";
import { WorkoutDashboard } from "@/components/WorkoutPage/WorkoutDashboard";
import { useWorkoutCourses } from "@/components/WorkoutPage/hooks/useWorkoutCourses";
import type { WorkoutListItem } from "@/components/WorkoutPage/workout-page.types";
import { useAuthStore } from "@/store/auth.store";
import type { Course } from "@/types/course.types";

export const ProfileClient = () => {
  const router = useRouter();

  const { isAuthorized, user, selectedCourses, setSelectedCourses } =
    useAuthStore(
    useShallow((state) => ({
      isAuthorized: state.isAuthorized,
      user: state.user,
      selectedCourses: state.selectedCourses,
      setSelectedCourses: state.setSelectedCourses,
    })),
  );

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [selectModalWorkouts, setSelectModalWorkouts] = useState<
    WorkoutListItem[]
  >([]);
  const [selectModalCourseName, setSelectModalCourseName] = useState("");
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState<Set<string>>(
    new Set(),
  );
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  const [workoutsError, setWorkoutsError] = useState("");

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

  const handleSelectCourse = async (course: Course) => {
    setSelectedCourseId(course._id);
    setSelectModalCourseName(course.nameRU);
    setIsLoadingWorkouts(true);
    setWorkoutsError("");

    try {
      const { completedWorkoutIds, items } = await loadCourseWorkouts(course);
      setCompletedWorkoutIds(completedWorkoutIds);
      setSelectModalWorkouts(items);
      setIsSelectModalOpen(true);
    } catch (error) {
      setWorkoutsError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить тренировки курса",
      );
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const handleSelectModalStart = (workoutId: string) => {
    setIsSelectModalOpen(false);
    router.push(`/courses/${selectedCourseId}/workouts/${workoutId}`);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12.5 md:px-35">
      <WorkoutDashboard
        courseProgressMap={courseProgressMap}
        courses={courses}
        coursesError={coursesError}
        isAuthorized={isAuthorized}
        isLoadingCourses={isLoadingCourses}
        isLoadingWorkouts={isLoadingWorkouts}
        onRemoveCourseAction={(courseId) => {
          void removeCourse(courseId);
        }}
        onSelectCourseAction={(course) => {
          void handleSelectCourse(course);
        }}
        profileEmail={user?.email ?? ""}
        profileName={user?.name ?? "Пользователь"}
        workoutsError={workoutsError}
      />

      <SelectWorkoutModal
        isOpen={isSelectModalOpen}
        courseName={selectModalCourseName}
        workouts={selectModalWorkouts}
        completedWorkoutIds={completedWorkoutIds}
        onCloseAction={() => {
          setIsSelectModalOpen(false);
        }}
        onStartAction={handleSelectModalStart}
      />
    </main>
  );
};
