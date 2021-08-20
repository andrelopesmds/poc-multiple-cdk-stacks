import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import { Tags } from '@aws-cdk/core';

export class Stack1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const myLambda1 = new lambda.Function(this, 'lambda1', {
      functionName: 'lambda1',
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.inline(`exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify('Hello from Lambda!')}};`),
    });

    Tags.of(myLambda1).add("owner", "team-x");

    new lambda.Function(this, 'lambda2', {
      functionName: 'lambda2',
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.inline(`exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify('Hello from Lambda!')}};`),
    });

  }
}
