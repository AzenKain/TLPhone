import { Module } from '@nestjs/common';
import { SchemaProductResolver } from './schema-product.resolver';
import { SchemaProductService } from './schema-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../types/product';
import { ItemSchemaProductDetailEntity, SchemaProductDetailEntity, SchemaProductEntity } from '../types/schemaProduct';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, SchemaProductEntity, SchemaProductDetailEntity, ItemSchemaProductDetailEntity]),
  ],
  providers: [SchemaProductResolver, SchemaProductService]
})
export class SchemaProductModule {}
