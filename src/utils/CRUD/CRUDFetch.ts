import { getAuth } from "firebase/auth";

export async function FetchFunction({ url, method, body }: { url: string; method: "GET" | "POST" | "DELETE"; body?: string }) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  return fetch(url, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
