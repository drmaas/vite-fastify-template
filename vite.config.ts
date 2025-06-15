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

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite'

const path = fileURLToPath(import.meta.url);
const root = resolve(dirname(path), '.');

const enableHTTPS = process.env.ENABLE_HTTPS === 'true';
console.log(`Enable HTTPS=${enableHTTPS}`);

// https://vitejs.dev/config/
export default defineConfig({
    root,
    plugins: [react(), tailwindcss()],
    server: {
        host: '0.0.0.0',
        port: 5173,
    },
    base: process.env.VITE_AWS_STAGE ? `/${process.env.VITE_AWS_STAGE}` : '/',
});
