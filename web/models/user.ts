export type User = {
  id: string
  firstName: string
  lastName: string
  name: string
  phone: string
  username: string
  email: string
  avatar: string
}

export type UserResponse = {
  users: User[]
}

/**
 * Fetches user data from the specified URL.
 * @param url - The URL from which to fetch user data.
 * @returns A promise that resolves to the user response.
 * @throws Throws an error if the fetch operation fails or if the response cannot be parsed as JSON.
 */
export const fetchUsers = (url: string) =>
  fetch(url).then<UserResponse>(r => r.json())
