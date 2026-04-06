const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Log API configuration on load
console.log(`🌐 API configured to: ${API_URL}`);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry(url, options = {}, retries = 3, timeout = 10000) {
  const controller = new AbortController();
  const config = { ...options, signal: controller.signal };

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`📡 [Attempt ${4 - retries}] ${config.method || 'GET'} ${url}`);
    
    const response = await fetch(url, config);
    const text = await response.text();
    clearTimeout(timeoutId);

    // Check for HTML response (indicates server error or waking up)
    if (typeof text === 'string' && text.trim().startsWith('<!DOCTYPE')) {
      console.warn(`⚠️  HTML response received (server may be waking up): ${response.status}`);
      return { success: false, error: 'Server waking up or returned an HTML response', status: response.status };
    }

    // Parse JSON response
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error(`❌ Invalid JSON response from ${url}:`, text.substring(0, 100));
      return { success: false, error: 'Invalid JSON response from server', status: response.status };
    }

    if (!response.ok) {
      const message = data?.message || data?.error || `API error ${response.status}`;
      console.error(`❌ API Error ${response.status}: ${message}`);
      return { success: false, error: message, status: response.status, ...data };
    }

    console.log(`✅ Success: ${response.status} ${url}`);
    return { success: true, status: response.status, ...data };
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.warn(`⏱️  Request timeout (${timeout}ms): ${url}`);
    } else {
      console.error(`❌ Fetch error: ${error.message}`);
    }
    
    if (retries > 0) {
      console.log(`🔄 Retrying in 3 seconds... (${retries} attempts left)`);
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
