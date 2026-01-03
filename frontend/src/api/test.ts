const API_URL = import.meta.env.VITE_API_URL;

export const ApiGetTest = async () => {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Error");
  }

  return response.json();
};
