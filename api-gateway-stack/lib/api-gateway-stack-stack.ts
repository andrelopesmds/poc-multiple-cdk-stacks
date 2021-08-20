import { LambdaIntegration, RestApi } from 'monocdk/aws-apigateway';
import { aws_lambda, Construct, Stack, StackProps } from 'monocdk';
import { HttpMethod } from 'monocdk/aws-apigatewayv2';
import { PolicyStatement, Role, ServicePrincipal } from 'monocdk/aws-iam';

export class ApiGatewayStackStack extends Stack {
  protected api: RestApi;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stack = Stack.of(this)

    // The code that defines your stack goes here
    this.api = new RestApi(this, 'poc-api', {
      restApiName: 'poc-api'
    })

    const role = new Role(this, 'ApiGatewayInvokeLambdaRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    role.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: ['lambda:InvokeFunction'],
    }));

    const resource = this.api.root.addResource('lambda1');

    const getFunctionArn =
      `arn:aws:lambda:${ stack.region }:${ stack.account }:function:lambda1`;

    const getFunction = aws_lambda.Function.fromFunctionArn(this, `lambda1-id`, getFunctionArn);

    const lambda1Integration = new LambdaIntegration(getFunction, {
      credentialsRole: role
    })

    resource.addMethod(HttpMethod.GET, lambda1Integration)
  }
}
