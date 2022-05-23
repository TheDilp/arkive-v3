import { useMutation } from "react-query";

export function useRegister() {
  return useMutation((vars: { username: string; password: string }) => {
    return fetch("http://localhost:4000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vars),
    });
  });
}
