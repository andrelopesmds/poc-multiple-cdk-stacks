import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import { ServicePrincipal }  from '@aws-cdk/aws-iam'

export class Stack1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const myLambda = new lambda.Function(this, 'Singleton', {
      functionName: 'lambda1',
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: "index.handler",
      code: lambda.Code.inline(`exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify('Hello from Lambda!')}};`),
    });

    myLambda.addPermission('APIGateway', {
      principal: new ServicePrincipal('apigateway.amazonaws.com')
    });
  }
}
