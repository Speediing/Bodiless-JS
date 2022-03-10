/**
 * Copyright © 2022 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentOrTag } from '@bodiless/fclasses';
import React, {
  useState, useRef, useLayoutEffect, FC
} from 'react';
import {
  HydrationHOC,
  WithoutHydrationFunction,
  WithoutHydrationProps
} from './types';

export const isStaticClientSide = !!(
  typeof window !== 'undefined'
  && window.document
  && window.document.createElement
  && process.env.NODE_ENV === 'production'
);

const getDisplayName = (WrappedComponent: ComponentOrTag<any>) => (typeof WrappedComponent !== 'string' && (WrappedComponent.displayName || WrappedComponent.name)) || 'Component';

const withoutHydrationServerSide: HydrationHOC = WrappedComponent => props => (
  <section data-no-hydrate>
    <WrappedComponent {...props} />
  </section>
);

const withoutHydrationClientSide: WithoutHydrationFunction = ({
  onUpdate = null,
  disableFallback = false
} = {}) => <P,>(WrappedComponent: ComponentOrTag<P>) => {
  const WithoutHydration: FC<P & WithoutHydrationProps> = (props) => {
    const { forceHydration = false } = props;
    const rootRef = useRef<HTMLElement>(null);
    const [shouldHydrate, setShouldHydrate] = useState<boolean | undefined>(undefined);

    useLayoutEffect(() => {
      if (shouldHydrate) return;
      const wasRenderedServerSide = !!rootRef.current?.getAttribute(
        'data-no-hydrate'
      );
      setShouldHydrate(
        (!wasRenderedServerSide && !disableFallback) || forceHydration
      );
    });

    useLayoutEffect(() => {
      if (shouldHydrate || shouldHydrate === undefined || !onUpdate) return;
      onUpdate(props, rootRef.current);
    });

    if (!shouldHydrate) {
      return (
        <section
          ref={rootRef}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: '' }}
          suppressHydrationWarning
        />
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithoutHydration.displayName = `WithoutHydration(${getDisplayName(WrappedComponent)})`;

  return WithoutHydration;
};

export const withoutHydration: WithoutHydrationFunction = (options) => {
  if (isStaticClientSide) return withoutHydrationClientSide(options);

  return withoutHydrationServerSide;
};
