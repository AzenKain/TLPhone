import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    ColorDetailEntity,
    ImageDetailEntity,
    ProductDetailEntity,
    ProductEntity, ProductVariantEntity,
    TagsEntity,
} from 'src/types/product';
import { UserEntity } from 'src/types/user';
import { In, Repository } from 'typeorm';
import {
    ColorDetailInp,
    CreateProductDto,
    DeleteProductDto, GetListProductDto,
    ProductDetailInp,
    SearchProductDto,
    TagsProductDto,
    UpdateProductDto,
} from './dtos';
import { OrderService } from 'src/order/order.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class ProductService {
    constructor(
        private orderService: OrderService,
        private readonly httpService: HttpService,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
        @InjectRepository(ImageDetailEntity) private imageDetailRepository: Repository<ImageDetailEntity>,
        @InjectRepository(TagsEntity) private tagsRepository: Repository<TagsEntity>,
        @InjectRepository(ColorDetailEntity) private colorRepository: Repository<ColorDetailEntity>,
        @InjectRepository(ProductVariantEntity) private productVariantRepository: Repository<ProductVariantEntity>,
    ) { }

    private CheckRoleUser(user: UserEntity) {
        if (!user.role.includes("ADMIN") && !user.role.includes("WEREHOUSEMANAGER")) {
            throw new ForbiddenException('The user does not have permission');
        }
    }

    async GetReportProduct(dto: SearchProductDto) {
        const dataRequest: ProductEntity[] = (await this.SearchProductWithOptionsService(dto)).data;
        const requestBody = {
            data: dataRequest,
            type: 'ReportProduct'
        };

        const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/export-file', requestBody, {
            responseType: 'arraybuffer',
        }),
        );

        return response.data;
    }


    async SearchProductWithOptionsService(dto: SearchProductDto) {
        const queryBuilder = this.productRepository.createQueryBuilder('product');

        queryBuilder
          .leftJoinAndSelect('product.details', 'details')
          .leftJoinAndSelect('details.imgDisplay', 'imgDisplay')
          .leftJoinAndSelect('details.brand', 'brand')
          .leftJoinAndSelect('details.color', 'color')
          .leftJoinAndSelect('details.variants', 'variants')
          .leftJoinAndSelect('details.attributes', 'attributes')
          .leftJoinAndSelect('variants.attributes', 'variantAttributes')


        queryBuilder.andWhere('product.isDisplay = :isDisplay', { isDisplay: true });

        if (dto.name) {
            queryBuilder.andWhere('product.name LIKE :name', { name: `%${dto.name}%` });
        }
        if (dto.category) {
            queryBuilder.andWhere('product.category LIKE :category', { category: `%${dto.category}%` });
        }
        if (dto.rangeMoney && dto.rangeMoney.length === 2) {
            const [min, max] = dto.rangeMoney;
            queryBuilder.andWhere('variants.displayPrice BETWEEN :min AND :max', { min, max });
        }

        if (dto.brand && dto.brand.length > 0) {
            queryBuilder.andWhere('brand.value IN (:...brands)', { brands: dto.brand.map(tag => tag.value.toLowerCase()) });
        }

        if (dto.attributes && dto.attributes.length > 0) {
            queryBuilder.andWhere('attributes.value IN (:...attributes)', { attributes: dto.attributes.map(attr => attr.value.toLowerCase()) });
        }

        if (dto.color && dto.color.length > 0) {
            queryBuilder.andWhere('color.colorName IN (:...colors)', { colors: dto.color.map(attr => attr.value.toLowerCase()) });
        }

        // Sorting
        if (dto.sort) {
            switch (dto.sort) {
                case 'price_asc':
                    queryBuilder.orderBy('variants.displayPrice', 'ASC');
                    break;
                case 'price_desc':
                    queryBuilder.orderBy('variants.displayPrice', 'DESC');
                    break;
                case 'created_at_asc':
                    queryBuilder.orderBy('product.created_at', 'ASC');
                    break;
                case 'created_at_desc':
                    queryBuilder.orderBy('product.created_at', 'DESC');
                    break;
                case 'updated_at_asc':
                    queryBuilder.orderBy('product.updated_at', 'ASC');
                    break;
                case 'updated_at_desc':
                    queryBuilder.orderBy('product.updated_at', 'DESC');
                    break;
                default:
                    break;
            }
        }

        const maxValue = await queryBuilder.getCount();

        let list_product = await queryBuilder.getMany();

        if (dto.hotSales) {
            const timeframes: Array<'week' | 'month' | 'year' | 'all'> = ['week', 'month', 'year', 'all'];
            let currentTimeframe: 'week' | 'month' | 'year' | 'all' = (dto.hotSales as 'week' | 'month' | 'year' | 'all') || 'week';

            let tmpOrder = await this.orderService.getOrderDetail(currentTimeframe);

            while (tmpOrder.length < dto.count) {
                const currentIndex = timeframes.indexOf(currentTimeframe);
                if (tmpOrder.length < dto.count) {
                    currentTimeframe = timeframes[currentIndex + 1];
                    if (currentTimeframe === 'all') {
                        list_product.sort((a, b) => b.buyCount - a.buyCount);
                        break;
                    }
                    tmpOrder = await this.orderService.getOrderDetail(currentTimeframe);
                } else {
                    list_product = list_product.filter((i) => tmpOrder.findIndex(e => e.productId === i.id) !== -1);
                    break;
                }
            }
        }
        if (dto.index < 0) {
            dto.index = 0
            dto.count = 0
        }
        if (dto.index && dto.count) {
            const offset = (dto.index - 1) * dto.count;
            list_product = list_product.slice(offset, offset + dto.count);
        }

        return { maxValue, data: list_product };
    }



    async GetTagsProductService(dto: TagsProductDto) {
        const queryBuilder = this.tagsRepository.createQueryBuilder('tagsDetail');
        if (dto.tags) {
            queryBuilder.andWhere('tagsDetail.type = :tagsType', { tagsType: dto.tags });
        }

        return await queryBuilder.getMany();
    }

    async GetColorsProductService(dto: ColorDetailInp) {
        const queryBuilder = this.colorRepository.createQueryBuilder('colorDetail');
        if (dto.colorName) {
            queryBuilder.andWhere('colorDetail.name = :colorName', { colorName: dto.colorName });
        }

        return await queryBuilder.getMany();
    }


    async GetProductByIdService(productId: number) {
        const product = await this.productRepository.findOne({
            where: { id: productId, isDisplay: true },
            relations: [
                'details',
                'details.imgDisplay',
                'details.brand',
                'details.color',
                'details.attributes',
                'details.variants',
                'details.variants.attributes'
            ],
        });

        if (!product) {
            throw new ForbiddenException('Product not found or not available');
        }

        return product;
    }
    async GetListProductByIdService(dto: GetListProductDto) {
        const products = await this.productRepository.find({
            where: {
                id: In(dto.products),
                isDisplay: true
            },
            relations: [
                'details',
                'details.imgDisplay',
                'details.brand',
                'details.color',
                'details.attributes',
                'details.variants',
                'details.variants.attributes'
            ],
        });

        if (!products || products.length === 0) {
            throw new ForbiddenException('Products not found or not available');
        }

        return products;
    }
    private async findOrCreateTag(tagValue: string, tagType: string): Promise<TagsEntity> {
        const tagLowerCase = tagValue.toLowerCase();
        let tag = await this.tagsRepository.findOne({ where: { value: tagLowerCase, type: tagType } });

        if (!tag) {
            tag = this.tagsRepository.create({ value: tagLowerCase, type: tagType });
            tag = await this.tagsRepository.save(tag);
        }

        return tag;
    }

    async CreateProductByListService(dto: CreateProductDto[], user: UserEntity) {
        const dataReturn : ProductEntity[] = []
        for (const product of dto) {
            dataReturn.push(await this.CreateProductService(product, user))
        }
        return dataReturn
    }

    async CreateProductService(dto: CreateProductDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const existingProduct = await this.productRepository.findOne({
            where: { name: dto.name, category: dto.category, isDisplay: true },
        });

        if (existingProduct) {
            throw new ForbiddenException('Product already exists with the same name and category.');
        }
        let savedImgDetails : ImageDetailEntity[] = []
        const savedColorDetails : ColorDetailEntity[] = []
        const savedVariantDetails : ProductVariantEntity[] = []

        if (dto.details.imgDisplay) {
            const imgDetails = dto.details.imgDisplay.map((img) =>
                this.imageDetailRepository.create({ url: img.url, link: img.link || [] })
            );
            savedImgDetails = await this.imageDetailRepository.save(imgDetails);
        }
        if (dto.details.color) {
            for (const it of dto.details.color) {
                let color = await this.colorRepository.findOne(
                    { where: { colorName:
                        it.colorName, colorHex: it.colorHex }
                    });
                if (!color) {
                    const tmpColor = this.colorRepository.create({ colorName: it.colorName, colorHex: it.colorHex })
                    color = await this.colorRepository.save(tmpColor);
                }
                savedColorDetails.push(color)
            }
        }
        
        if (dto.details.variants) {
            for (const variant of dto.details.variants) {
                let attributesVariants : TagsEntity[] = [];
                attributesVariants = await Promise.all(
                    variant.attributes.map(async (it) =>
                    await this.findOrCreateTag(it.value, it.type)
                  )
                );

                const newVariant = this.productVariantRepository.create({
                    displayPrice: variant.displayPrice || 0,
                    originPrice: variant.originPrice || 0,
                    stockQuantity: variant.stockQuantity || 0,
                    hasImei: variant.hasImei || false,
                    imeiList: variant.imeiList || [],
                    attributes: attributesVariants
                })

                savedVariantDetails.push(await this.productVariantRepository.save(newVariant))
            }
        }
        const brandTag = dto.details.brand?.value ? await this.findOrCreateTag(dto.details.brand.value, 'brand') : null;

        let attributesTag : TagsEntity[] = [];

        if (dto.details.attributes) {
            attributesTag = await Promise.all(
              dto.details.attributes.map(async (it) =>
                await this.findOrCreateTag(it.value, it.type)
              )
            );
        }
        const newProductDetail = this.productDetailRepository.create({
            attributes: attributesTag,
            brand: brandTag,
            description: dto.details.description || '',
            variants: savedVariantDetails,
            imgDisplay: savedImgDetails,
            color: savedColorDetails,
            tutorial: dto.details.tutorial || '',
        });


        const savedProductDetail = await this.productDetailRepository.save(newProductDetail);

        const newProduct = this.productRepository.create({
            name: dto.name,
            isDisplay: true,
            category: dto.category,
            details: savedProductDetail,
        });

        return await this.productRepository.save(newProduct);
    }

    async DeleteProductService(dto: DeleteProductDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const product = await this.productRepository.findOne({ where: { id: dto.productId } });

        if (!product) {
            throw new ForbiddenException('Product not found');
        }

        product.isDisplay = false;
        await this.productRepository.save(product);

        return { message: 'Product successfully soft deleted' };
    }

    private async updateProductDetails(details: ProductDetailEntity, dtoDetails: ProductDetailInp): Promise<ProductDetailEntity> {
        if (dtoDetails.brand && dtoDetails.brand.value) {
            details.brand = await this.findOrCreateTag(dtoDetails.brand.value, 'brand');
        }

        if (dtoDetails.description) {
            details.description = dtoDetails.description;
        }
        if (dtoDetails.tutorial) {
            details.tutorial = dtoDetails.tutorial;
        }
        if (dtoDetails.attributes) {
            details.attributes = [];
            const attrDetails = [];
            for (const attr of dtoDetails.attributes) {

                const existingImageDetails = await this.tagsRepository.findOne({
                    where: { type: attr.type, value: attr.value  }
                });

                if (!existingImageDetails) {
                    const newAttrs = this.tagsRepository.create({
                        type: attr.type,
                        value: attr?.value,
                    });
                    attrDetails.push(await this.tagsRepository.save(newAttrs));
                }
                else {
                    attrDetails.push(existingImageDetails)
                }
            }
            details.attributes = attrDetails;
        }
        if (dtoDetails.imgDisplay) {
            details.imgDisplay = [];
            const imgDetails = [];
            for (const img of dtoDetails.imgDisplay) {

                const existingImageDetails = await this.imageDetailRepository.findOne({
                    where: { url: img.url }
                });
    
                if (!existingImageDetails) {
                    const newImageDetail = this.imageDetailRepository.create({
                        url: img.url,
                        link: img?.link || []
                    });
                    imgDetails.push(await this.imageDetailRepository.save(newImageDetail));
                }
                else {
                    imgDetails.push(existingImageDetails)
                }
            }
            details.imgDisplay = imgDetails;
        }
        if (dtoDetails.color) {
            details.variants = [];
            const colorDetails = [];
            for (const it of dtoDetails.color) {

                const existingColorDetails = await this.colorRepository.findOne({
                    where: { colorName: it.colorName}
                });

                if (!existingColorDetails) {
                    const newImageDetail = this.colorRepository.create({
                        colorName: it.colorName,
                        colorHex: it.colorHex || "",
                    });
                    colorDetails.push(await this.colorRepository.save(newImageDetail));
                }
                else {
                    colorDetails.push(existingColorDetails)
                }
            }
            details.color = colorDetails;
        }
        if (dtoDetails.variants) {
            const variantDetails = [];
            for (const variant of dtoDetails.variants) {
                const existingVariant = details.variants.find(v => {
                    if (v.attributes.length === variant.attributes.length) {
                        let count = 0;
                        v.attributes.forEach((att, index) => {
                            if (att.value?.toLowerCase() === variant.attributes[index]?.value?.toLowerCase() &&
                              att.type === variant.attributes[index]?.type) {
                                count++;
                            }
                        });
                        return count === v.attributes.length;
                    }
                    return false;
                });

                if (!existingVariant) {
                    let attributesVariants: TagsEntity[] = [];
                    attributesVariants = await Promise.all(
                      variant.attributes.map(async (it) => await this.findOrCreateTag(it.value, it.type))
                    );

                    const newVariant = this.productVariantRepository.create({
                        displayPrice: variant.displayPrice || 0,
                        originPrice: variant.originPrice || 0,
                        stockQuantity: variant.stockQuantity || 0,
                        hasImei: variant.hasImei || true,
                        imeiList: variant.imeiList || [],
                        attributes: attributesVariants
                    });
                    const savedVariant = await this.productVariantRepository.save(newVariant);
                    variantDetails.push(savedVariant);
                } else {
                    variantDetails.push(existingVariant);
                }
            }
            details.variants = variantDetails;
        }

        return await this.productDetailRepository.save(details);
    }


    async UpdateProductService(dto: UpdateProductDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const product = await this.productRepository.findOne({
            where: { id: dto.productId, isDisplay: true },
            relations: [
                'details',
                'details.imgDisplay',
                'details.brand',
                'details.color',
                'details.attributes',
                'details.variants',
                'details.variants.attributes'
            ],
        });

        if (!product) {
            throw new ForbiddenException('Product not found or is not available for update');
        }

        if (dto.name) product.name = dto.name;
        if (dto.category) product.category = dto.category;

        if (dto.details) {
            product.details = await this.updateProductDetails(product.details, dto.details);
        }

        return await this.productRepository.save(product);
    }
}
