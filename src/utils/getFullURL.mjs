export const getFullURL = (urlStr, origin) => {
  try {
    const URLObject = new URL(urlStr);

    return { success: true, url: URLObject };
  } catch (error) {
    return { success: false, error };
  }
};
