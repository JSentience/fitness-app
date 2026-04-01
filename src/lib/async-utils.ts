export async function resolveOrNull<T>(resolver: () => Promise<T>): Promise<T | null> {
  try {
    return await resolver();
  } catch {
    return null;
  }
}

export async function resolveOrFallback<T>(
  resolver: () => Promise<T>,
  fallbackValue: T,
): Promise<T> {
  const resolvedValue = await resolveOrNull(resolver);

  return resolvedValue ?? fallbackValue;
}
