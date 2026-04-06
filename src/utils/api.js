const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry(url, options = {}, retries = 3, timeout = 10000) {
  const controller = new AbortController();
  const config = { ...options, signal: controller.signal };

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    clearTimeout(timeoutId);

    if (typeof text === 'string' && text.trim().startsWith('<!DOCTYPE')) {
      return { success: false, error: 'Server waking up or returned an HTML response', status: response.status };
    }

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      return { success: false, error: 'Invalid JSON response from server', status: response.status };
    }

    if (!response.ok) {
      const message = data?.message || data?.error || `API error ${response.status}`;
      return { success: false, error: message, status: response.status, ...data };
    }

    return { success: true, status: response.status, ...data };
  } catch (error) {
    clearTimeout(timeoutId);
    if (retries > 0) {
      await delay(3000);
      return fetchWithRetry(url, options, retries - 1, timeout);
    }

    return {
      success: false,
      error: error.name === 'AbortError' ? 'Request timed out' : error.message || 'Server not reachable'
    };
  }
}

export { API_URL };
