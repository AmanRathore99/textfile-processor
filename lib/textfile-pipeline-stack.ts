import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class TextfilePipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table to store each line from uploaded text files
    const textTable = new dynamodb.Table(this, 'TextLinesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
    });

    // Lambda function to process uploaded files and store lines in DynamoDB
    const processFileFunction = new lambda.Function(this, 'ProcessTextFileLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'processFile.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        TABLE_NAME: textTable.tableName
      }
    });

    // Give Lambda write access to the DynamoDB table
    textTable.grantWriteData(processFileFunction);

    // API Gateway setup to expose an endpoint for uploading files
    const api = new apigateway.RestApi(this, 'TextUploadApi', {
      restApiName: 'Text File Upload Service'
    });

    // POST /upload → triggers Lambda
    api.root.addResource('upload').addMethod('POST', new apigateway.LambdaIntegration(processFileFunction));
  }
}