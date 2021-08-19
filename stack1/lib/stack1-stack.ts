import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');

export class Stack1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new lambda.Function(this, 'Singleton', {
      functionName: 'lambda1',
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.Code.inline('exports.handler = function(event, ctx, cb) { return cb(null, "hello world"); }'),
    });
  }
}
