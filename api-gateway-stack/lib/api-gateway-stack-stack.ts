import { LambdaIntegration, RestApi } from 'monocdk/aws-apigateway';
import { aws_lambda, Construct, Stack, StackProps } from 'monocdk';
import { HttpMethod } from 'monocdk/aws-apigatewayv2';
import { PolicyStatement, Role, ServicePrincipal, Effect } from 'monocdk/aws-iam';

export class ApiGatewayStackStack extends Stack {
  protected api: RestApi;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stack = Stack.of(this)

    // The code that defines your stack goes here
    this.api = new RestApi(this, 'poc-api', {
      restApiName: 'poc-api'
    })

    const resource1 = this.api.root.addResource('lambda1');
    const resource2 = this.api.root.addResource('lambda2');

    const getFunction1Arn = `arn:aws:lambda:${stack.region}:${stack.account}:function:lambda1`;
    const getFunction2Arn = `arn:aws:lambda:${stack.region}:${stack.account}:function:lambda2`;

    const getFunction1 = aws_lambda.Function.fromFunctionArn(this, `lambda1-id`, getFunction1Arn);
    const getFunction2 = aws_lambda.Function.fromFunctionArn(this, `lambda2-id`, getFunction2Arn);

    const role = new Role(this, 'ApiGatewayInvokeLambdaRole', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });

    role.addToPolicy(new PolicyStatement({
      resources: [getFunction1Arn],  // f1 reachable and f2 not
      actions: ['lambda:InvokeFunction']
    }));

    const lambda1Integration = new LambdaIntegration(getFunction1, {
      credentialsRole: role
    })
    const lambda2Integration = new LambdaIntegration(getFunction2, {
      credentialsRole: role
    })

    resource1.addMethod(HttpMethod.GET, lambda1Integration)
    resource2.addMethod(HttpMethod.GET, lambda2Integration)
  }
}
