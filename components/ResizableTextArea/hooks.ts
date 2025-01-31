import * as React from 'react';
import useLatest from 'use-latest';

export {default as useComposedRef} from 'use-composed-ref';

export const useWindowResizeListener = (listener: (event: UIEvent) => void) => {
  const latestListener = useLatest(listener);

  React.useLayoutEffect(() => {
    const handler: typeof listener = (event) => {
      latestListener.current(event);
    };

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
