#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {EcrStack} from "../lib/ecr.stack";
import {VpcStack} from "../lib/vpc.stack";
import {ElasticContainerStack} from "../lib/elastic-container.stack";
import {Route53Stack} from "../lib/route53.stack";

const app = new cdk.App()
const ecr = new EcrStack(app, EcrStack.name, {})
const vpc = new VpcStack(app, VpcStack.name, {})
const ecs = new ElasticContainerStack(app, ElasticContainerStack.name, {
    vpc: vpc.vpc,
    repository: ecr.repository,
})
new Route53Stack(app, Route53Stack.name, { loadBalancer: ecs.loadBalancer })
