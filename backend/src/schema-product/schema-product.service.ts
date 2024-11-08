import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../types/product';
import { Repository } from 'typeorm';
import {
  ItemSchemaProductDetailEntity,
  SchemaProductDetailEntity,
  SchemaProductEntity,
  SchemaProductType,
} from '../types/schemaProduct';
import { CreateSchemaProductDto, DeleteSchemaProductDto, UpdateSchemaProductDto } from './dtos';
import { UserEntity } from '../types/user';
import { ResponseType } from '../types/response.type';



@Injectable()
export class SchemaProductService {
  constructor(
    private config: ConfigService,
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(SchemaProductEntity) private schemaProductRepository: Repository<SchemaProductEntity>,
    @InjectRepository(SchemaProductDetailEntity) private schemaProductDetailRepository: Repository<SchemaProductDetailEntity>,
    @InjectRepository(ItemSchemaProductDetailEntity) private itemSchemaProductDetailRepository: Repository<ItemSchemaProductDetailEntity>,
  ) { }

  private CheckRoleUser(user: UserEntity) {
    if (!user.role.includes("ADMIN")) {
      throw new ForbiddenException('The user does not have permission');
    }
  }

  async GetSchemaProductByIdService(id: number): Promise<SchemaProductType> {
    const schemaProduct = await this.schemaProductRepository.findOne({
      where: { id },
      relations: ["details", "details.attributes"],
    });
    if (!schemaProduct) {
      throw new NotFoundException(`Schema product with ID ${id} not found.`);
    }
    return schemaProduct;
  }

  async GetAllSchemaProductService(): Promise<SchemaProductType[]> {
    return await this.schemaProductRepository.find({
      relations: ["details", "details.attributes"],
    });
  }

  async CreateSchemaProductService(dto: CreateSchemaProductDto, user: UserEntity): Promise<SchemaProductEntity> {
    this.CheckRoleUser(user);
    const schemaDetails: SchemaProductDetailEntity[] = [];

    for (const detailDto of dto.detail) {
      const itemAttributes: ItemSchemaProductDetailEntity[] = [];
      for (const attributeDto of detailDto.attributes || []) {
        const itemAttribute = this.itemSchemaProductDetailRepository.create({
          isUseForSearch: attributeDto.isUseForSearch,
          value: attributeDto.value,
        });
        itemAttributes.push(itemAttribute);
      }
      const schemaDetail = this.schemaProductDetailRepository.create({
        title: detailDto.title,
        attributes: itemAttributes,
      });
      schemaDetails.push(schemaDetail);
    }
    const schemaProduct = this.schemaProductRepository.create({
      name: dto.name,
      category: dto.category,
      isDisplay: true,
      detail: schemaDetails,
    });
    return await this.schemaProductRepository.save(schemaProduct);
  }

  async UpdateSchemaProductService(dto: UpdateSchemaProductDto, user: UserEntity): Promise<SchemaProductEntity> {
    this.CheckRoleUser(user);
    const schemaProduct = await this.schemaProductRepository.findOne({
      where: { id: dto.schemaId },
      relations: ['detail', 'detail.attributes']
    });
    if (!schemaProduct) {
      throw new NotFoundException(`Schema Product ID not found!.`);
    }

    schemaProduct.name = dto.name;
    schemaProduct.category = dto.category;

    const schemaDetails: SchemaProductDetailEntity[] = [];

    for (const detailDto of dto.detail) {
      const existingDetail = schemaProduct.detail.find(detail => detail.title === detailDto.title);

      let schemaDetail: SchemaProductDetailEntity;
      if (existingDetail) {
        schemaDetail = existingDetail;
      } else {
        schemaDetail = this.schemaProductDetailRepository.create({
          title: detailDto.title,
        });
      }

      const itemAttributes: ItemSchemaProductDetailEntity[] = [];
      for (const attributeDto of detailDto.attributes || []) {
        const existingAttribute = schemaDetail.attributes.find(attr => attr.value === attributeDto.value);
        let itemAttribute: ItemSchemaProductDetailEntity;

        if (existingAttribute) {
          itemAttribute = existingAttribute;
          itemAttribute.isUseForSearch = attributeDto.isUseForSearch;
        } else {
          itemAttribute = this.itemSchemaProductDetailRepository.create({
            isUseForSearch: attributeDto.isUseForSearch,
            value: attributeDto.value,
          });
        }
        itemAttributes.push(itemAttribute);
      }

      schemaDetail.attributes = itemAttributes;
      schemaDetails.push(schemaDetail);
    }

    schemaProduct.detail = schemaDetails;

    return await this.schemaProductRepository.save(schemaProduct);
  }
  async DeleteSchemaProductService(dto: DeleteSchemaProductDto, user: UserEntity): Promise<ResponseType> {
    this.CheckRoleUser(user);
    const schemaProduct = await this.schemaProductRepository.findOne({
      where: { id: dto.schemaId  },
      relations: ['detail', 'detail.attributes']
    });
    if (!schemaProduct) {
      throw new NotFoundException(`Schema Product ID not found!.`);
    }
    schemaProduct.isDisplay = false;
    await this.schemaProductRepository.save(schemaProduct);
    return { message: 'Product successfully soft deleted' };
  }
}