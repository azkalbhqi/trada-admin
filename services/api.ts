const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type RequestOptions = RequestInit & {
  params?: Record<string, string | number>;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${BASE_URL}${endpoint}`;

  // Handle query params
  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    url += `?${query}`;
  }

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(fetchOptions.headers || {}),
    },
    ...fetchOptions,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }

  return res.json();
}