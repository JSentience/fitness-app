/**
 * Maps course nameEN (from API) to a local image path in /public/images.
 * The API does not return course images, so we maintain this mapping client-side.
 * Keys are lowercase to make lookups case-insensitive.
 */
export const COURSE_IMAGES: Record<string, string> = {
  yoga: "/images/yoga.png",
  stretching: "/images/stretching.png",
  bodyflex: "/images/bodyflex.png",
  fitness: "/images/fitness.png",
  "step aerobics": "/images/step-aerobics.png",
};

/** Fallback image when no mapping is found for a course. */
export const COURSE_IMAGE_FALLBACK = "/images/fitness.png";

/**
 * Returns the local image path for a given course nameEN.
 * Falls back to COURSE_IMAGE_FALLBACK if no match is found.
 *
 * @example
 * getCourseImage("Yoga")     // "/images/yoga.png"
 * getCourseImage("unknown")  // "/images/fitness.png"
 */
export function getCourseImage(nameEN: string): string {
  return COURSE_IMAGES[nameEN.toLowerCase()] ?? COURSE_IMAGE_FALLBACK;
}
