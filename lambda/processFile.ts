import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

interface LambdaEvent {
  body: string;
}

interface LambdaResponse {
  statusCode: number;
  body: string;
}

export const handler = async (event: LambdaEvent): Promise<LambdaResponse> => {
  console.log("Event received:", JSON.stringify(event));

  try {
    const body = JSON.parse(event.body);
    const { filename, content } = body;

    console.log("Request body parsed:", body);

    const lines = content.split('\n');
    const results = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        const record = {
          TableName: process.env.TABLE_NAME!,
          Item: {
            id: `${filename}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            line: trimmedLine
          }
        };

        console.log("Saving item:", record);
        const response = await dynamoDb.put(record).promise();
        results.push(response);
      }
    }

    console.log("Insert completed for all lines.");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File processed successfully' }),
    };
  } catch (error) {
    console.error("Error during processing:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Processing failed' }),
    };
  }
};
