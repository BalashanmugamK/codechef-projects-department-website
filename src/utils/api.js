// Environment variable for API URL (Vite requires VITE_ prefix)
const API_URL = import.meta.env.VITE_API_URL?.trim();

// Debug log to verify environment variable is loaded
console.log(`🌐 API configured to: ${API_URL}`);
console.log(`🔧 Environment: ${import.meta.env.MODE}`);
console.log(`📡 VITE_API_URL: ${import.meta.env.VITE_API_URL ? 'Set' : 'Not set'}`);

// Validate API URL is configured
if (!API_URL) {
  console.error('❌ VITE_API_URL environment variable is not set!');
  console.error('   Please set VITE_API_URL in your environment variables.');
  console.error('   Vercel: Dashboard > Project > Settings > Environment Variables');
  console.error('   Local: Create .env file with VITE_API_URL=your-api-url');
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry(
  endpoint,
  options = {},
  retries = 3,
  timeout = 10000
) {
  // Safety net: handle both full URLs and endpoints
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint}`;

  const controller = new AbortController();
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
    signal: controller.signal,
  };

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`📡 [Attempt ${4 - retries}] ${config.method || "GET"} ${url}`);

    const response = await fetch(url, config);
    const text = await response.text();
    clearTimeout(timeoutId);

    // 🔥 Detect HTML (Render cold start / crash)
    if (text.trim().startsWith("<!DOCTYPE")) {
      console.warn("⚠️ Server returned HTML (likely waking up)");
      return {
        success: false,
        error: "Server waking up or invalid response",
        status: response.status,
      };
    }

    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error("❌ Invalid JSON:", text.slice(0, 100));
      return {
        success: false,
        error: "Invalid JSON response",
        status: response.status,
      };
    }

    if (!response.ok) {
      const message =
        data?.message || data?.error || `API error ${response.status}`;
      console.error(`❌ ${message}`);
      return { success: false, error: message, status: response.status };
    }

    console.log(`✅ ${response.status} ${endpoint}`);
    return { success: true, ...data };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.warn(`⏱️ Timeout: ${url}`);
    } else {
      console.error(`❌ Fetch error: ${error.message}`);
    }

    if (retries > 0) {
      console.log(`🔄 Retrying in 3s... (${retries} left)`);
      await delay(3000);
      return fetchWithRetry(endpoint, options, retries - 1, timeout);
    }

    return {
      success: false,
      error:
        error.name === "AbortError"
          ? "Request timed out"
          : "Server not reachable",
    };
  }
}

export { API_URL };

// Example: Simple fetch function using the environment variable
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
}
