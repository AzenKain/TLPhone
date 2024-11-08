import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuardGraphql } from '../auth/guard';
import { SchemaProductService } from './schema-product.service';
import { SchemaProductType } from '../types/schemaProduct';
import { CurrentUserGraphql } from '../decorators';
import { UserEntity } from '../types/user';
import { ResponseType } from '../types/response.type';
import { CreateSchemaProductDto, DeleteSchemaProductDto, UpdateSchemaProductDto } from './dtos';

@UseGuards(JwtGuardGraphql)
@Resolver()
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

  @Query(() => [SchemaProductType])
  async GetAllSchemaProduct(
  ): Promise<SchemaProductType[]> {
    return await this.schemaProductService.GetAllSchemaProductService();
  }

  @Query(() => SchemaProductType)
  async CreateSchemaProduct(
    @CurrentUserGraphql() user: UserEntity,
    @Args('UpdateSchemaProduct') dto: CreateSchemaProductDto
  ): Promise<SchemaProductType> {
    return await this.schemaProductService.CreateSchemaProductService(dto, user);
  }

  @Query(() => SchemaProductType)
  async UpdateSchemaProduct(
    @CurrentUserGraphql() user: UserEntity,
    @Args('UpdateSchemaProduct') dto: UpdateSchemaProductDto
  ): Promise<SchemaProductType> {
    return await this.schemaProductService.UpdateSchemaProductService(dto, user);
  }

  @Query(() => ResponseType)
  async DeleteSchemaProduct(
    @CurrentUserGraphql() user: UserEntity,
    @Args('DeleteSchemaProduct') dto: DeleteSchemaProductDto
  ): Promise<ResponseType> {
    return await this.schemaProductService.DeleteSchemaProductService(dto, user);
  }
}
