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

import { useEffect, useState } from "react";
import { sampleAction } from "../services/sample-service";

type MainComponentProps = {
  message: string;
};

export default function MainComponent({ message }: MainComponentProps) {
  const [toastMsg, setToastMsg] = useState<string | undefined>(undefined);

  const handleButtonClick = async () => {
    const response = await sampleAction("test");
    setToastMsg(response);
  };

  useEffect(() => {
    // Hide toast after 3 seconds
    const timer = setTimeout(() => setToastMsg(undefined), 3000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      {toastMsg && (
        <div className="fixed top-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {toastMsg}
        </div>
      )}
      <p className="text-2xl font-semibold mb-8">
        Welcome to the Vite Fastify Template.
        <br />
        This template uses a custom fastify server to power static assets and custom APIs.
        <br /><br />
        Sample api message: {message}
      </p>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Execute Service
      </button>
    </>
  );
}
