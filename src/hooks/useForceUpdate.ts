import { useState, useCallback } from 'react';

export const useForceUpdate = () => {
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  return forceUpdate;
}; 