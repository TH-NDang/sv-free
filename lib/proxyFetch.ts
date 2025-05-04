/**
 * Utility function to make a request through the Next.js API proxy to avoid CORS issues
 * @param url The external URL to make a request to
 * @param options Fetch options (method, headers, body, etc.)
 * @returns The response data from the external API
 */
const PROXY_URL = "/api/proxy";
export async function proxyFetch({
  url,
  headers,
  body,
  options,
}: {
  url: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  options?: RequestInit;
}): Promise<Response> {
  try {
    if (!options || options.method === "GET" || !options.method) {
      // Phương thức GET - sử dụng query parameters
      const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;

      const response = await fetch(proxyUrl);

      return response;
    }

    // Các phương thức khác (POST, PUT, DELETE...) - sử dụng POST request
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: headers || {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body,
        url,
        options,
      }),
    });

    return response;
  } catch (error) {
    console.error("Error using proxy fetch:", error);
    throw error;
  }
}
