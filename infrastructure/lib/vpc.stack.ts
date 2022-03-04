import {IVpc, SubnetType, Vpc} from "aws-cdk-lib/aws-ec2";
import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";

export class VpcStack extends Stack {
    public readonly vpc: IVpc

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)
        this.vpc = new Vpc(this, "exanubes-vpc", {
            cidr: "10.100.0.0/16",
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: "public-1",
                    cidrMask: 24,
                    subnetType: SubnetType.PUBLIC,
                },
                {
                    name: "private-1",
                    cidrMask: 24,
                    subnetType: SubnetType.PRIVATE_WITH_NAT,
                }
            ],
        })
    }
}
