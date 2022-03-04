import {RemovalPolicy, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {IRepository, Repository} from "aws-cdk-lib/aws-ecr";

export class EcrStack extends Stack {
    public readonly repository: IRepository
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)
        this.repository = new Repository(this, "exanubes-repository", {
            imageScanOnPush: false,
            removalPolicy: RemovalPolicy.DESTROY,
        })
    }
}
