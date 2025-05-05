/**
 * Utility function to make a request through the Next.js API proxy to avoid CORS issues
 * @param url The external URL to make a request to
 * @param options Fetch options (method, headers, body, etc.)
 * @returns The response data from the external API
 */
const PROXY_URL = "/api/proxy";
const FORMDATA_PROXY_URL = "/api/proxy/formdata";

export async function proxyFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    if (!options || options.method === "GET" || !options.method) {
      // Phương thức GET - sử dụng query parameters
      const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      return response;
    }

    // Special handling for FormData requests
    if (options.body instanceof FormData) {
      // Use the specialized FormData proxy endpoint
      const proxyUrl = `${FORMDATA_PROXY_URL}?url=${encodeURIComponent(url)}`;

      // Forward the request directly to our specialized endpoint
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: options.headers,
        body: options.body, // Pass FormData directly
      });

      return response;
    }

    // For regular JSON requests, proceed as normal
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        options: {
          ...options,
          body: options.body,
        },
      }),
    });

    return response;
  } catch (error) {
    console.error("Error using proxy fetch:", error);
    throw error;
  }
}
