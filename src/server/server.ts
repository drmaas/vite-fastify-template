#!/usr/bin/env node
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

import pino from "pino";
import Fastify, { FastifyInstance } from "fastify";
import { fastifyFormbody } from "@fastify/formbody";
import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

import cors from "@fastify/cors";
import awsLambdaFastify, { LambdaResponse } from "@fastify/aws-lambda";
// Add type-only import for AWS Lambda types
import type { Context } from "aws-lambda";
import { APIGatewayEvent } from "aws-lambda/trigger/api-gateway-proxy";

const local = () => {
  return (
    import.meta.url === process.argv[1] ||
    process.env.AWS_LAMBDA_FUNCTION_NAME === undefined
  );
};

// https://github.com/sjinks/fastify-favicon/blob/master/index.js
const ico = Buffer.from(
  "AAABAAEAEBACAAEAAQCwAAAAFgAAACgAAAAQAAAAIAAAAAEAAQAAAAAAQAAAAAAAAAAAAAAAAgAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "base64"
).toString("binary");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function run() {
  const server = Fastify({
    logger: {
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label: string) => {
          return { level: label.toUpperCase() };
        },
      },
    },
  });

  const base = process.env.AWS_STAGE ? `/${process.env.AWS_STAGE}/` : "/";

  server
    .register(fastifyFormbody)
    .register(cors, {
      origin: ["http://localhost:4173", "http://localhost:5173"],
    })
    .register(fastifyStatic, {
      root: path.join(__dirname, local() ? "../../dist" : "dist"),
      prefix: base,
    });

  server.get(`${base}api/sample`, async (_, res) => {
    server.log.info("GET /api/sample called");
    res.code(200).send({ message: `hello` });
  });

  server.post(`${base}api/sample`, async (req, res) => {
    server.log.info("POST /api/sample called");
    const body = req.body as { action?: string };
    const action = body.action;
    server.log.info(`Action received: ${action}`);
    res.code(201).send({ message: action });
  });

  server.get(`${base}favicon.ico`, (_, reply) => {
    return reply
      .header("cache-control", "max-age=86400")
      .type("image/x-icon")
      .send(ico);
  });

  return server;
}

let server: FastifyInstance;

export async function start(): Promise<FastifyInstance> {
  server = await run();
  try {
    const port = process.env.PORT || "3000";
    await server.listen({ port: Number(port), host: "0.0.0.0" });
    server.log.info(`Server started on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
  return server;
}

export async function stop() {
  await server.close();
  server.log.info("Server stopped");
}

export type APIGatewayEventHandler = (
  event: APIGatewayEvent,
  context: Context
) => Promise<LambdaResponse>;
export type APIGatewayEventHandlerProvider = (
  app: () => FastifyInstance
) => APIGatewayEventHandler;

// Lambda handler export using @fastify/aws-lambda
const handlerProvider: APIGatewayEventHandlerProvider = (
  app: () => FastifyInstance
) => {
  const proxy = awsLambdaFastify(app());
  const handler = async (event: APIGatewayEvent, context: Context) => {
    return proxy(event, context);
  };
  return handler;
};

export const handler = handlerProvider(() => run());

if (local()) {
  start();
}
