import * as cdk from '@aws-cdk/core';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { Function, CfnPermission } from '@aws-cdk/aws-lambda';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2';

export class ApiGatewayStackStack extends cdk.Stack {
  protected api: RestApi;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    this.api = new RestApi(this, 'poc-api', {
      restApiName: 'poc-api'
    })

    const resource = this.api.root.addResource('lambda1');

    // from console
    const lambda1 = {
      id: 'lambda1-id',
      arn: 'arn:aws:lambda:us-east-1:125523035986:function:lambda1'
    }

    const lambda1Function = Function.fromFunctionArn(
      this,
      lambda1.id,
      lambda1.arn,
    )

    const lambda1Integration = new LambdaIntegration(lambda1Function)

    resource.addMethod(HttpMethod.GET, lambda1Integration)

    // check if we can make this permission less strict - invoke all lambdas instead of 1 - could solve if the problem is permissions?
    new CfnPermission(this, `${lambda1.id}-api-permission`, {
      principal: 'apigateway.amazonaws.com',
      action: 'lambda:InvokeFunction',
      functionName: lambda1Function.functionName,
      sourceArn: this.api.arnForExecuteApi()
    })

  }
}
