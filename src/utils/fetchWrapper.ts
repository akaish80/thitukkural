// Session-level cache: stores in-flight or resolved promises for GET requests.
// A single Map entry per URL ensures concurrent callers share one request.
const sessionCache = new Map<string, Promise<any>>();

export function clearSessionCache(): void {
  sessionCache.clear();
}

export default async function fetchWrapper(url: string): Promise<any> {
  if (sessionCache.has(url)) {
    return sessionCache.get(url)!;
  }

  const promise = fetch(url).then((response) => {
    if (!response.ok) {
      // Remove failed entry so it can be retried next time
      sessionCache.delete(url);
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }).catch((err) => {
    sessionCache.delete(url);
    throw err;
  });

  sessionCache.set(url, promise);
  return promise;
}
