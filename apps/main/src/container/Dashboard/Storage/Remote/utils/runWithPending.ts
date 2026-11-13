export async function runWithPending(
  setPending: (pending: boolean) => void,
  task: () => Promise<void>,
) {
  setPending(true);
  try {
    await task();
  } finally {
    setPending(false);
  }
}
