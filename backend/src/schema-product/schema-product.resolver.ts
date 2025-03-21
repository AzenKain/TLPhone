import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuardGraphql } from '../auth/guard';
import { SchemaProductService } from './schema-product.service';
import { SchemaProductType } from '../types/schemaProduct';
import { CurrentUserGraphql } from '../decorators';
import { UserEntity } from '../types/user';
import { ResponseType } from '../types/response.type';
import { CreateSchemaProductDto, DeleteSchemaProductDto, UpdateSchemaProductDto } from './dtos';

@Resolver(() => SchemaProductType)
export class SchemaProductResolver {
  constructor(
    private schemaProductService: SchemaProductService,
  ) { }
  @Query(() => SchemaProductType)
  async GetSchemaProductById(
    @Args('schemaProductId') id: number
  ): Promise<SchemaProductType> {
    return await this.schemaProductService.GetSchemaProductByIdService(id);
  }
  @Query(() => SchemaProductType)
  async GetSchemaProductByName(
    @Args('schemaProductName') name: string
  ): Promise<SchemaProductType> {
    return await this.schemaProductService.GetSchemaProductByNameService(name);
  }
  @Query(() => [SchemaProductType])
  async GetAllSchemaProduct(
  ): Promise<SchemaProductType[]> {
    return await this.schemaProductService.GetAllSchemaProductService();
  }

  @UseGuards(JwtGuardGraphql)
  @Mutation(() => SchemaProductType)
  async CreateSchemaProduct(
    @CurrentUserGraphql() user: UserEntity,
    @Args('CreateSchemaProduct') dto: CreateSchemaProductDto
  ): Promise<SchemaProductType> {
    return await this.schemaProductService.CreateSchemaProductService(dto, user);
  }
  @UseGuards(JwtGuardGraphql)
  @Mutation(() => SchemaProductType)
  async UpdateSchemaProduct(
    @CurrentUserGraphql() user: UserEntity,
    @Args('UpdateSchemaProduct') dto: UpdateSchemaProductDto
  ): Promise<SchemaProductType> {
    return await this.schemaProductService.UpdateSchemaProductService(dto, user);
  }
  @UseGuards(JwtGuardGraphql)
  @Mutation(() => ResponseType)
  async DeleteSchemaProduct(
    @CurrentUserGraphql() user: UserEntity,
    @Args('DeleteSchemaProduct') dto: DeleteSchemaProductDto
  ): Promise<ResponseType> {
    return await this.schemaProductService.DeleteSchemaProductService(dto, user);
  }
}
