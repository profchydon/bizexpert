import { useState, useCallback } from "react";

const useKeyGenerator = () => {
  const [internalKey, setInternalKey] = useState<string>();

  const generateKey = useCallback(() => {
    const randomString = Math.random().toString(36);
    setInternalKey(randomString);
  }, []);

  return { internalKey, generateKey };
};

export default useKeyGenerator;
