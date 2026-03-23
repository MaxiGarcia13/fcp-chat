export function useStorage() {
  const baseKey = 'fcp:storage:'

  const getKey = (key: string) => {
    return `${baseKey}${key}`
  }

  const storage = () => {
    return localStorage
  }

  const get = (key: string) => {
    return storage()?.getItem(getKey(key))
  }

  const set = (key: string, value: string) => {
    storage()?.setItem(getKey(key), value)
  }

  const getJson = (key: string) => {
    return JSON.parse(get(key))
  }

  const setJson = (key: string, value: unknown) => {
    set(key, JSON.stringify(value))
  }

  const remove = (key: string) => {
    storage()?.removeItem(getKey(key))
  }

  return {
    get,
    set,
    remove,
    getJson,
    setJson,
  }
}
