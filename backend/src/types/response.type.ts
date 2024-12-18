import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType("ResponseType")
export class ResponseType {
    @Field()
    message: string
}


@ObjectType("RequestType")
export class RequestType {
    @Field()
    isRequest: boolean

    @Field(() => ID, {nullable : true})
    otpId?: number
}

