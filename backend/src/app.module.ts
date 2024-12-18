import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailEntity, UserEntity } from './types/user';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import {
  ColorDetailEntity,
  FaultyProductEntity,
  ImageDetailEntity,
  ProductDetailEntity,
  ProductEntity,
  ProductVariantEntity,
  TagsEntity,
} from './types/product';
import {
  CustomerInfoEntity,
  DeliveryInfoEntity,
  OrderEntity,
  OrderProductEntity, OrderStatusHistoryEntity,
  PaymentInfoEntity,
} from './types/order';
import { BlogModule } from './blog/blog.module';
import { BlogEntity } from './types/blog';
import { MediaModule } from './media/media.module';
import { AnalyticModule } from './analytic/analytic.module';
import { ItemSchemaProductDetailEntity, SchemaProductDetailEntity, SchemaProductEntity } from './types/schemaProduct';
import { SchemaProductModule } from './schema-product/schema-product.module';
import { ReviewEntity } from './types/review';
import { CampaignEntity } from './types/campaign';
import { RefundEntity } from './types/refund';
import { CartEntity, CartItemEntity } from './types/cart';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { OtpEntity } from './types/otp';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


@Module({
  imports: [    
    JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
    }),
    inject: [ConfigService],
    global: true,
  }), 
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env']
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './schema.gql',
      sortSchema: true,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: +configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USERNAME'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [
          UserEntity, 
          UserDetailEntity,
          ProductEntity, 
          ProductDetailEntity,
          ProductVariantEntity,
          ColorDetailEntity,
          FaultyProductEntity,
          ImageDetailEntity,
          OrderEntity, 
          CustomerInfoEntity,
          DeliveryInfoEntity,
          PaymentInfoEntity,
          OrderProductEntity,
          SchemaProductEntity,
          SchemaProductDetailEntity,
          ItemSchemaProductDetailEntity,
          ReviewEntity,
          TagsEntity,
          BlogEntity,
          CampaignEntity,
          RefundEntity,
          CartEntity,
          CartItemEntity,
          OrderStatusHistoryEntity,
          OtpEntity
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    OrderModule,
    BlogModule,
    MediaModule,
    AnalyticModule,
    SchemaProductModule,
    CartModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
          port: 587,
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
