import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";

export class AppsyncDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-appsync--dynamodb-api",
      schema: appsync.Schema.fromAsset("schema/schema.gql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });
    //creating lambda function
    const lambda_function = new lambda.Function(this, "MyFunction", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("lambda"),
    });
    //Defining datasource
    const lambda_datasource = api.addLambdaDataSource(
      "lambda_datasource",
      lambda_function
    );

    // Resolvers
    lambda_datasource.createResolver({
      typeName: "Query",
      fieldName: "welcome",
    });

    lambda_datasource.createResolver({
      typeName: "Mutation",
      fieldName: "addProduct",
    });

    //creating dynamodb Table
    const productTable = new ddb.Table(this, "productTable", {
      tableName: "Products",
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });

    // enable the Lambda function to access the DynamoDB table (using IAM)
    productTable.grantFullAccess(lambda_function);
    lambda_function.addEnvironment("TABLE_NAME", productTable.tableName);
  }
}
