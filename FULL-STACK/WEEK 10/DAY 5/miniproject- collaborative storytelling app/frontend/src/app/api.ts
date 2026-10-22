import type { AuthResponse } from "@shared"

const API = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "")

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

interface Hooks {
  getToken: () => string | null
  setSession: (session: AuthResponse) => void
  onAuthFail: () => void
}

let hooks: Hooks = {
  getToken: () => null,
  setSession: () => {},
  onAuthFail: () => {},
}

export const bindApi = (nextHooks: Hooks) => {
  hooks = nextHooks
}

let refreshing: Promise<string | null> | null = null

function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = fetch(`${API}/refresh`, { method: "POST", credentials: "include" })
      .then(async (res) => {
        if (!res.ok) return null
        const session = (await res.json()) as AuthResponse
        hooks.setSession(session)
        return session.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

interface Options {
  method?: string
  body?: unknown
  auth?: boolean
}

export async function request<T>(
  path: string,
  { method = "GET", body, auth = true }: Options = {},
): Promise<T> {
  const send = (token: string | null) =>
    fetch(`${API}${path}`, {
      method,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

  let res: Response
  try {
    res = await send(auth ? hooks.getToken() : null)
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.")
  }

  if (res.status === 401 && auth) {
    const fresh = await refreshAccessToken()
    if (fresh) {
      try {
        res = await send(fresh)
      } catch {
        throw new ApiError(0, "Can't reach the server. Check your connection and try again.")
      }
      if (res.status === 401) hooks.onAuthFail()
    } else {
      hooks.onAuthFail()
    }
  }

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null
    throw new ApiError(res.status, data?.message ?? "Something went wrong. Please try again.")
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}
