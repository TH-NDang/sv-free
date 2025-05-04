const PROXY_URL = "/api/proxy";
/**
 * Performs a fetch request through a proxy server to bypass CORS or other restrictions.
 *
 * For GET requests, the target URL is encoded and passed as a query parameter to the proxy.
 * For other HTTP methods (POST, PUT, DELETE, etc.), the request details are sent in the body
 * of a POST request to the proxy.
 *
 * @param {Object} params - The parameters for the proxy fetch operation
 * @param {string} params.url - The target URL to fetch from
 * @param {HeadersInit} [params.headers] - Optional headers to include in the request
 * @param {BodyInit | null} [params.body] - Optional body for the request
 * @param {RequestInit} [params.options] - Optional fetch options
 * @returns {Promise<Response>} A promise that resolves to the fetch Response
 * @throws {Error} Rethrows any errors that occur during the fetch operation
 */
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
