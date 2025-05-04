/**
 * Utility function to make a request through the Next.js API proxy to avoid CORS issues
 * @param url The external URL to make a request to
 * @param options Fetch options (method, headers, body, etc.)
 * @returns The response data from the external API
 */

export async function proxyFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<{
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}> {
  try {
    if (!options || options.method === "GET" || !options.method) {
      // Phương thức GET - sử dụng query parameters
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);

      if (!response.ok) {
        throw new Error(`Proxy request failed with status ${response.status}`);
      }

      return await response.json();
    }

    // Các phương thức khác (POST, PUT, DELETE...) - sử dụng POST request
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        options,
      }),
    });

    if (!response.ok) {
      throw new Error(`Proxy request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error using proxy fetch:", error);
    throw error;
  }
}
