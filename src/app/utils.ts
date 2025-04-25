import { useRouter } from 'next/navigation'

export const useFetch = () => {
  const router = useRouter()

  const _fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
    const r = await fetch(input, init)

    if (r.status !== 200) {
      router.push('/login')
    }

    return r.json()
  }

  return _fetch
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  return emailRegex.test(email)
}
