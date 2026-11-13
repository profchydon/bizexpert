export const updateVisibilityAfterDelay = (
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
  delay: number,
) => {
  const timer = setTimeout(() => {
    setIsVisible(true);
  }, delay);

  return () => clearTimeout(timer);
};
