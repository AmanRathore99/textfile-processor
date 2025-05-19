# Text File Processor - Serverless Pipeline

This project implements a simple serverless pipeline using AWS services. It allows uploading a text file through an API, processes its content line by line, and stores each line in a DynamoDB table.

---

## 🧰 Tech Stack

- **AWS CDK** (TypeScript)
- **AWS Lambda** (Node.js)
- **Amazon API Gateway**
- **Amazon DynamoDB**

---

## 🚀 Project Structure

- `lib/` → CDK stack that provisions the Lambda, API Gateway, and DynamoDB table.
- `lambda/` → Contains the Lambda function (`processFile.js`) that handles file processing.

---

## 🛠️ Installation & Setup

Make sure you have the AWS CLI configured and CDK installed

```bash
# 1. Install dependencies
npm install

# 2. Bootstrap CDK (only once per environment)
cdk bootstrap

# 3. Deploy the stack
cdk deploy
