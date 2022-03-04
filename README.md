# ECS Fargate Deployment


Repository from [exanubes.com](https://exanubes.com) for [Deploying ECS Fargate Application](https://exanubes.com/blog/deploying-ecs-fargate-application).


This repository is using AWS CDK v2 and is not compatible with AWS CDK v1 bootstrap stack.

## Commands:

Run the following commands inside `infrastructure` directory for building, deploying and destroying the stacks

```
npm run build
npm run cdk:deploy
npm run cdk:destroy
```


Both of these commands use the `aws-cli sts` service to get the account id and aws IAM role `exanubes-cloudformation-access` in order to dynamically provide role arn. Make sure you're using the account you want to deploy the stacks to and that you have the role created either with the same name or different name and change the scripts in `package.json`.
