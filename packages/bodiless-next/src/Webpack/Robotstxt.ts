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
import robotsTxt from 'generate-robotstxt';

import { join, resolve } from 'path';
import { writeFileSync } from 'fs';
import bodilessNextConfigPath, { RobotstxtConfig } from '../NextConfig/bodilessNextConfigLoader';

const generateRobotsTxt = (options: Partial<RobotstxtConfig> | undefined) => {
  if (!process.env.ROBOTSTXT_ENABLED) return;
  const publicPath = './public';

  const mergedOptions = {
    ...bodilessNextConfigPath.robotstxt || {},
    ...options || {}
  };

  robotsTxt(mergedOptions)
    .then((content: string) => {
      const filename = join(publicPath, mergedOptions.output);
      return writeFileSync(resolve(filename), content);
    })
    .catch((error: Error) => {
      throw error;
    });
};

export default generateRobotsTxt;
