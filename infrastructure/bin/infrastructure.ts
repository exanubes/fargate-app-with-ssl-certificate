#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {EcrStack} from "../lib/ecr.stack";
import {VpcStack} from "../lib/vpc.stack";
import {ElasticContainerStack} from "../lib/elastic-container.stack";


const app = new cdk.App()
const ecr = new EcrStack(app, EcrStack.name, {})
const vpc = new VpcStack(app, VpcStack.name, {})
new ElasticContainerStack(app, ElasticContainerStack.name, {
    vpc: vpc.vpc,
    repository: ecr.repository,
})
