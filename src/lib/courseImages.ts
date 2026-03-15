/**
 * Maps course `nameEN` (from API) to local image paths in `/public/courses/cards`
 * for the course cards shown on the main page.
 * Keys are lowercase to make lookups case-insensitive.
 */
export const COURSE_IMAGES: Record<string, string> = {
  yoga: "/courses/cards/yoga.png",
  stretching: "/courses/cards/stretching.png",
  bodyflex: "/courses/cards/bodyflex.png",
  fitness: "/courses/cards/fitness.png",
  stepairobic: "/courses/cards/step-aerobics.png",
};

/**
 * Maps course `nameEN` (from API) to local skill/banner image paths in
 * `/public/courses/details` for the course detail page.
 * Keys are lowercase to make lookups case-insensitive.
 */
export const COURSE_SKILL_IMAGES: Record<string, string> = {
  yoga: "/courses/details/yoga-id.png",
  stretching: "/courses/details/stretching-id.png",
  bodyflex: "/courses/details/body-flex-id.png",
  fitness: "/courses/details/fitness-id.png",
  stepairobic: "/courses/details/step-id.png",
};

/** Fallback image for generic course cards. */
export const COURSE_IMAGE_FALLBACK = "/courses/cards/fitness.png";

/** Fallback image for course detail skill/banner blocks. */
export const COURSE_SKILL_IMAGE_FALLBACK = "/courses/details/fitness-id.png";

/**
 * Returns the local card image path for a given course `nameEN`.
 */
export function getCourseImage(nameEN: string): string {
  return COURSE_IMAGES[nameEN.toLowerCase()] ?? COURSE_IMAGE_FALLBACK;
}

/**
 * Returns the local skill/banner image path for a given course `nameEN`.
 */
export function getCourseSkillImage(nameEN: string): string {
  return (
    COURSE_SKILL_IMAGES[nameEN.toLowerCase()] ?? COURSE_SKILL_IMAGE_FALLBACK
  );
}
