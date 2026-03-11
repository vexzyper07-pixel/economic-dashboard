const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const buildUrl = (path) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const buildOptions = (options = {}) => {
  const config = { ...options };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  config.headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  return config;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), buildOptions(options));
  const data = await parseResponse(response);

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message;
    throw new Error(message || "Request failed");
  }

  return data;
};

export const authorizedRequest = (token, path, options = {}) => {
  if (!token) {
    throw new Error("Authentication token missing");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  };

  return apiRequest(path, { ...options, headers });
};

export { API_BASE_URL };
