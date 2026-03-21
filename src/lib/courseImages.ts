export const COURSE_IMAGES: Record<string, string> = {
  yoga: "/courses/cards/yoga.png",
  stretching: "/courses/cards/stretching.png",
  bodyflex: "/courses/cards/bodyflex.png",
  fitness: "/courses/cards/fitness.png",
  stepairobic: "/courses/cards/step-aerobics.png",
};

export const COURSE_SKILL_IMAGES: Record<string, string> = {
  yoga: "/courses/details/yoga-id.png",
  stretching: "/courses/details/stretching-id.png",
  bodyflex: "/courses/details/body-flex-id.png",
  fitness: "/courses/details/fitness-id.png",
  stepairobic: "/courses/details/step-id.png",
};

export const COURSE_IMAGE_FALLBACK = "/courses/cards/fitness.png";

export const COURSE_SKILL_IMAGE_FALLBACK = "/courses/details/fitness-id.png";

export function getCourseImage(nameEN: string): string {
  return COURSE_IMAGES[nameEN.toLowerCase()] ?? COURSE_IMAGE_FALLBACK;
}

export function getCourseSkillImage(nameEN: string): string {
  return (
    COURSE_SKILL_IMAGES[nameEN.toLowerCase()] ?? COURSE_SKILL_IMAGE_FALLBACK
  );
}
