import { clientRequest } from "@/lib/client-api";

export type CourseMutationResponse = {
  message: string;
};

export async function addUserCourseClient(
  courseId: string,
): Promise<CourseMutationResponse> {
  return clientRequest<CourseMutationResponse>("/api/users/me/courses", {
    method: "POST",
    body: { courseId },
  });
}

export async function removeUserCourseClient(
  courseId: string,
): Promise<CourseMutationResponse> {
  return clientRequest<CourseMutationResponse>(
    `/api/users/me/courses/${courseId}`,
    {
      method: "DELETE",
    },
  );
}
