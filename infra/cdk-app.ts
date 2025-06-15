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

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ViteFastifyLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stageName = 'prod';

    const fn = new lambda.Function(this, 'ViteFastifyLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'server.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        NODE_ENV: 'production',
        VITE_AWS_STAGE: stageName, // Add AWS_STAGE for Vite base path
      },
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
    });

    // Create a resource policy statement allowing only the above IPs
    const apiResourcePolicy = new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [new cdk.aws_iam.AnyPrincipal()],
      actions: ["execute-api:Invoke"],
      resources: ["*"]
    });

    const api = new apigateway.LambdaRestApi(this, 'ViteFastifyApiGateway', {
      handler: fn,
      proxy: true,
      deployOptions: {
        stageName,
      },
      policy: new cdk.aws_iam.PolicyDocument({
        statements: [apiResourcePolicy]
      })
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}

const app = new cdk.App();
new ViteFastifyLambdaStack(app, 'ViteFastifyLambdaStack'); 