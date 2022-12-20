import { SignInData, SignUpData } from "./utils/types";

const port = 3005;
const baseUrl = `http://localhost:${port}`;

function request(url: string, options: RequestInit = {}) {
  options.headers = options.headers || {};

  //@ts-ignore
  options.headers.Authorization = localStorage.token;

  return fetch(url, options).then((res) => res.json());
}

function post(url: string, data: object) {
  return request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function signup(data: SignUpData) {
  return post(`${baseUrl}/sign-up`, data);
}

export function login(data: SignInData) {
  return post(`${baseUrl}/login`, data);
}

export function validate() {
  return request(`${baseUrl}/validate`, {
    headers: {
      Authorization: localStorage.token,
    },
  });
}
