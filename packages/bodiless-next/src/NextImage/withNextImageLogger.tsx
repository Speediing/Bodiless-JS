/**
 * Copyright © 2023 Johnson & Johnson
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

import React, { FC } from 'react';
import { useNode } from '@bodiless/core';
import { HOC } from '@bodiless/fclasses';
// TODO: NEXT JS Implements the logger if necessary.
// import { log } from '../fsLogger';
import NextImagePresets from './NextImagePresets';

type Props = {
  preset: NextImagePresets
};

const log = (message: string) => console.log(message);

/**
 * `withNextImageLogger` is a HOF that fails Next build and logs errors when there
 * is a mismatch between the image preset passed as an argument to the Next Image node
 * and the corresponding image preset stored in the image node JSON file.
 */
const withNextImageLogger = (preset?: NextImagePresets): HOC => Component => {
  const WithNextImageLogger: FC<any> = props => {
    const { node } = useNode<any>();
    const { preset: presetFromProps } = props as Props;
    const { data: { canonicalPreset } = {} } = node;
    const expectedPreset = preset || canonicalPreset || undefined;
    if (expectedPreset !== presetFromProps && presetFromProps !== undefined) {
      log(`
        Data mismatch found for node with path ${node.path.join('$')}.
        Image preset passed as a prop ${presetFromProps}.
        Image preset passed to hoc as a param ${preset}.
      `);
    }
    return <Component {...props} />;
  };
  return WithNextImageLogger;
};

export default withNextImageLogger;
