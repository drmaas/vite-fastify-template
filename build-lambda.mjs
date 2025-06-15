// Copyright 2025 Daniel Maas
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/server/server.ts'],
  outfile: 'lambda/server.mjs',
  bundle: true,
  platform: 'node',
  target: 'esnext',
  format: 'esm',
  minify: true,
  external: ['aws-sdk'],
  sourcesContent: true,
  logLevel: 'info',
  splitting: false,
  treeShaking: true, // explicit, but enabled by default for ESM
  sourcemap: true,
  // https://github.com/evanw/esbuild/issues/1921#issuecomment-1152991694
  banner: {
      js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);',
  },
}).catch(() => process.exit(1)); 