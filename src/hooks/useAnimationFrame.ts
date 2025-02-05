import { useEffect, useRef } from "react";

export const useAnimationFrame = (enabled: boolean, callback: (delta: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const delta = time - previousTimeRef.current;
      callback(delta);
    }

    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (enabled) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [enabled]);
};
