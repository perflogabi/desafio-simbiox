type Listener = () => void;

let params = new URLSearchParams();
const listeners = new Set<Listener>();

export function getSearchParams(): URLSearchParams {
  return params;
}

export function subscribeSearchParams(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetSearchParams(search = ""): void {
  params = new URLSearchParams(search);

  for (const listener of listeners) {
    listener();
  }
}
