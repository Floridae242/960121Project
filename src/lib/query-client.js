export function queryClient() {
  return {
    async get(path) {
      return { path, data: null };
    },
  };
}
