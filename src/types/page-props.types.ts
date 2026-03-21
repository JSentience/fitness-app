export type SearchParams<T extends Record<string, string | undefined>> =
  Promise<T>;

export type RouteParams<T extends Record<string, string>> = Promise<T>;

export type PageWithSearchParamsProps<
  T extends Record<string, string | undefined>,
> = {
  searchParams?: SearchParams<T>;
};

export type PageWithParamsProps<T extends Record<string, string>> = {
  params: RouteParams<T>;
};
