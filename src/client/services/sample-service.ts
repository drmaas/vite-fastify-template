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

const AWS_STAGE = import.meta.env.VITE_AWS_STAGE;
const base = AWS_STAGE ? `/${AWS_STAGE}/` : "/";

export const sampleGet: () => Promise<string> = () =>
  fetch(`${base}api/sample`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Received message:", data.message);
      return data.message;
    })
    .catch((error) => {
      console.error("Error fetching message:", error);
      throw error;
    });

export const sampleAction: (action: string) => Promise<string> = (
  action: string
) =>
  fetch(`${base}api/sample`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Sent message:", action);
      console.log("Received message:", data.message);
      return data.message;
    })
    .catch((error) => {
      console.error("Error fetching message:", error);
    });
