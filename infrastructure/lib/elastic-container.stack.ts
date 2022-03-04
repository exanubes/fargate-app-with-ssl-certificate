import {IVpc, Peer, Port, SecurityGroup} from "aws-cdk-lib/aws-ec2";
import {Duration, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {IRepository} from "aws-cdk-lib/aws-ecr";
import {
    Cluster,
    CpuArchitecture,
    EcrImage,
    FargateService,
    FargateTaskDefinition,
    OperatingSystemFamily
} from "aws-cdk-lib/aws-ecs";
import {
    ApplicationLoadBalancer,
    ApplicationProtocol,
    ApplicationProtocolVersion
} from "aws-cdk-lib/aws-elasticloadbalancingv2";


interface Props extends StackProps {
    vpc: IVpc
    repository: IRepository
}

const CONTAINER_PORT = 8081

export class ElasticContainerStack extends Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props)
        const cluster = new Cluster(this, "exanubes-cluster", {
            vpc: props.vpc,
            clusterName: "exanubes-cluster",
            containerInsights: true,
        })


        const albSg = new SecurityGroup(this, "security-group-load-balancer", {
            vpc: props.vpc,
            allowAllOutbound: true,
        })
        albSg.addIngressRule(Peer.anyIpv4(), Port.tcp(CONTAINER_PORT))

        const loadBalancer = new ApplicationLoadBalancer(this, "exanubes-alb", {
            vpc: props.vpc,
            loadBalancerName: "exanubes-ecs-alb",
            internetFacing: true,
            idleTimeout: Duration.minutes(10),
            securityGroup: albSg,
            http2Enabled: false,
            deletionProtection: false,
        })

        const httpListener = loadBalancer.addListener("http listener", {
            port: CONTAINER_PORT,
            open: true,
            protocol: ApplicationProtocol.HTTP
        })

        const targetGroup = httpListener.addTargets("tcp-listener-target", {
            targetGroupName: "tcp-target-ecs-service",
            protocol: ApplicationProtocol.HTTP,
            protocolVersion: ApplicationProtocolVersion.HTTP1,
        })

        const taskDefinition = new FargateTaskDefinition(
            this,
            "fargate-task-definition",
            {
                runtimePlatform: {
                    cpuArchitecture: CpuArchitecture.ARM64,
                    operatingSystemFamily: OperatingSystemFamily.LINUX,
                },
            }
        )
        const container = taskDefinition.addContainer("web-server", {
            image: EcrImage.fromEcrRepository(props.repository),
        })
        container.addPortMappings({
            containerPort: CONTAINER_PORT,
        })




        const securityGroup = new SecurityGroup(this, "http-sg", {
            vpc: props.vpc,
        })
        securityGroup.addIngressRule(
            Peer.securityGroupId(albSg.securityGroupId),
            Port.tcp(CONTAINER_PORT),
            "Allow inbound connections from ALB"
        )
        const fargateService = new FargateService(this, "fargate-service", {
            cluster,
            assignPublicIp: false,
            taskDefinition,
            securityGroups: [securityGroup],
            desiredCount: 1,
        })

        targetGroup.addTarget(fargateService)


    }
}
