import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetailEntity, UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';
import {
  ChangePasswordDto,
  CreateUserDto,
  SearchUserDto,
  UpdateHeartDto,
  UpdateProfileDto,
  UpdateRoleDto,
} from './dtos';
import * as argon from 'argon2';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ResponseType } from 'src/types/response.type';
import { CartService } from '../cart/cart.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private cart: CartService,
    private readonly httpService: HttpService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private userDetailRepository: Repository<UserDetailEntity>,
    private readonly mailerService: MailerService,
  ) {}
  private CheckRoleUser(user: UserEntity) {
    if (!user.role.includes('ADMIN')) {
      throw new ForbiddenException('The user does not have permission');
    }
  }
  async GetReportUser(dto: SearchUserDto, userCurrent: UserEntity) {
    const dataRequest: UserEntity[] = (
      await this.SearchUserWithOptionsServices(dto, userCurrent)
    ).data;

    const requestBody = {
      data: dataRequest,
      type: 'ReportUser',
    };

    const response = await firstValueFrom(
      this.httpService.post('http://localhost:8000/export-file', requestBody, {
        responseType: 'arraybuffer',
      }),
    );

    return response.data;
  }
  async CreateUserByListService(dto: CreateUserDto[], userCurrent: UserEntity) {
    this.CheckRoleUser(userCurrent);
    const dataReturn: UserEntity[] = [];
    for (const user of dto) {
      dataReturn.push(await this.CreateUserService(user, userCurrent));
    }
    return dataReturn;
  }

  async SearchUserWithOptionsServices(
    dto: SearchUserDto,
    userCurrent: UserEntity,
  ) {
    this.CheckRoleUser(userCurrent);
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.details', 'details');

    if (dto.email) {
      query.andWhere('LOWER(user.email) LIKE :email', {
        email: `%${dto.email.toLowerCase()}%`,
      });
    }

    if (dto.firstName) {
      query.andWhere('LOWER(details.firstName) LIKE :firstName', {
        firstName: `%${dto.firstName.toLowerCase()}%`,
      });
    }

    if (dto.lastName) {
      query.andWhere('LOWER(details.lastName) LIKE :lastName', {
        lastName: `%${dto.lastName.toLowerCase()}%`,
      });
    }

    if (dto.role && dto.role.length > 0) {
      const conditions = dto.role
        .map((role, index) => `FIND_IN_SET(:role${index}, user.role) > 0`)
        .join(' OR ');
      const parameters = dto.role.reduce(
        (acc, role, index) => ({ ...acc, [`role${index}`]: role }),
        {},
      );
      query.andWhere(`(${conditions})`, parameters);
    }

    if (dto.phoneNumber) {
      query.andWhere('details.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${dto.phoneNumber}%`,
      });
    }

    if (dto.birthday) {
      query.andWhere('details.birthday = :birthday', {
        birthday: dto.birthday,
      });
    }

    if (dto.address) {
      query.andWhere('LOWER(details.address) LIKE :address', {
        address: `%${dto.address.toLowerCase()}%`,
      });
    }

    if (dto.gender) {
      query.andWhere('LOWER(details.gender) LIKE :gender', {
        gender: `%${dto.gender.toLowerCase()}%`,
      });
    }

    if (dto.sort) {
      switch (dto.sort) {
        case 'created_at_asc':
          query.orderBy('user.created_at', 'ASC');
          break;
        case 'created_at_desc':
          query.orderBy('user.created_at', 'DESC');
          break;
        default:
          break;
      }
    }

    if (dto.index < 0) {
      dto.index = 0;
      dto.count = 0;
    }
    if (dto.index !== null && dto.count !== null) {
      query.skip(dto.index).take(dto.count);
    }

    const users = await query.getMany();
    const maxValue = await query.getCount();

    for (const tmpUser of users) {
      delete tmpUser.hash;
      delete tmpUser.refreshToken;
    }

    return { maxValue, data: users };
  }
  async UpdateRoleService(
    dto: UpdateRoleDto,
    userCurrent: UserEntity,
  ): Promise<UserEntity> {
    this.CheckRoleUser(userCurrent);
    const user = await this.userRepository.findOne({
      where: { secretKey: dto.userId },
      relations: [
        'details',
        'cart',
        'cart.cartProducts',
        'cart.cartProducts',
        'cart.cartProducts.product',
        'cart.cartProducts.product.details',
        'cart.cartProducts.product.details.imgDisplay',
        'cart.cartProducts.product.details.brand',
        'cart.cartProducts.productVariant',
        'cart.cartProducts.productVariant.attributes',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const valid: string[] = ['ADMIN', 'USER', 'STAFF', 'INACTIVE'];

    for (const role of dto.role) {
      if (!valid.includes(role)) {
        throw new NotFoundException('Role not found');
      }
    }

    user.role = dto.role;

    const dataReturn = await this.userRepository.save(user);
    delete dataReturn.hash;
    delete dataReturn.refreshToken;
    return dataReturn;
  }

  async UpdateProfileService(
    dto: UpdateProfileDto,
    userCurrent: UserEntity,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { secretKey: userCurrent.secretKey },
      relations: [
        'details',
        'cart',
        'cart.cartProducts',
        'cart.cartProducts',
        'cart.cartProducts.product',
        'cart.cartProducts.product.details',
        'cart.cartProducts.product.details.imgDisplay',
        'cart.cartProducts.product.details.brand',
        'cart.cartProducts.productVariant',
        'cart.cartProducts.productVariant.attributes',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const genderType: string[] = ['MALE', 'FEMALE', 'OTHER'];
    if (!genderType.includes(dto.gender)) {
      throw new ForbiddenException('This gender does not exist');
    }

    user.details.firstName = dto.firstName
      ? dto.firstName
      : user.details.firstName;
    user.details.lastName = dto.lastName ? dto.lastName : user.details.lastName;
    user.details.phoneNumber = dto.phoneNumber
      ? dto.phoneNumber
      : user.details.phoneNumber;
    user.details.birthday = dto.birthday ? dto.birthday : user.details.birthday;
    user.details.address = dto.address ? dto.address : user.details.address;
    user.details.gender = dto.gender ? dto.gender : user.details.gender;
    user.details.imgDisplay = dto.imgDisplay
      ? dto.imgDisplay
      : user.details.imgDisplay;
    const dataReturn = await this.userRepository.save(user);
    delete dataReturn.hash;
    delete dataReturn.refreshToken;
    return dataReturn;
  }

  async DeleteUserService(
    userId: string,
    userCurrent: UserEntity,
  ): Promise<ResponseType> {
    this.CheckRoleUser(userCurrent);
    const user = await this.userRepository.findOne({
      where: {
        secretKey: userId,
      },
    });

    if (user) {
      throw new ForbiddenException('This user is not exist!');
    }
    user.isDisplay = false;
    await this.userRepository.save(user);
    return { message: 'Soft delete user is successfully!' } as ResponseType;
  }

  async CreateUserService(
    dto: CreateUserDto,
    userCurrent: UserEntity,
  ): Promise<UserEntity> {
    this.CheckRoleUser(userCurrent);
    const genderType: string[] = ['MALE', 'FEMALE', 'OTHER'];
    if (!genderType.includes(dto.gender)) {
      throw new ForbiddenException('This gender does not exist');
    }
    const checkMail = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (checkMail != null) {
      throw new ForbiddenException('This email was existed before');
    }

    const hash = await argon.hash(dto.password);
    const userDetail = this.userDetailRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      birthday: dto.birthday,
      address: dto.address,
      gender: dto.gender,
    });

    const savedUserDetail = await this.userDetailRepository.save(userDetail);
    const newCart = await this.cart.CreateCart();
    const UserCre = this.userRepository.create({
      secretKey: uuidv5(dto.email, uuidv5.URL),
      email: dto.email,
      hash: hash,
      refreshToken: uuidv4(),
      details: savedUserDetail,
      role: ['STAFF'],
      heart: [],
      cart: newCart,
    });
    const dataReturn = await this.userRepository.save(UserCre);
    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Account Staff TLPhone',
      template: 'newAccount',
      context: {
        email: dto.email,
        password: dto.password,
      },
    });
    delete dataReturn.hash;
    delete dataReturn.refreshToken;
    return dataReturn;
  }

  async GetUserByIdService(
    userId: string,
    userCurrent: UserEntity,
  ): Promise<UserEntity> {
    if (
      !userCurrent.role.includes('ADMIN') &&
      !(userCurrent.secretKey == userId) &&
      !userCurrent.role.includes('HUMMANRESOURCE')
    ) {
      throw new ForbiddenException('The user does not have permission');
    }

    const user = await this.userRepository.findOne({
      where: {
        secretKey: userId,
        isDisplay: true,
      },
      relations: [
        'details',
        'cart',
        'cart.cartProducts',
        'cart.cartProducts',
        'cart.cartProducts.product',
        'cart.cartProducts.product.details',
        'cart.cartProducts.product.details.imgDisplay',
        'cart.cartProducts.product.details.brand',
        'cart.cartProducts.productVariant',
        'cart.cartProducts.productVariant.attributes',
      ],
    });

    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }

    delete user.hash;
    delete user.refreshToken;
    return user;
  }
  async changePasswordService(payload: ChangePasswordDto, userCurrent: UserEntity) {
    const user = await this.userRepository.findOne({
      where: {
        secretKey: userCurrent.secretKey,
        isDisplay: true,
      },
      relations: [
        'details',
        'cart',
        'cart.cartProducts',
        'cart.cartProducts',
        'cart.cartProducts.product',
        'cart.cartProducts.product.details',
        'cart.cartProducts.product.details.imgDisplay',
        'cart.cartProducts.product.details.brand',
        'cart.cartProducts.productVariant',
        'cart.cartProducts.productVariant.attributes',
      ],
    });

    if (!user) throw new ForbiddenException('This user does not exist');

    if (user.role.includes('INACTIVE')) {
      throw new ForbiddenException(`This user had INACTIVE`);
    }

    const pwMatches = await argon.verify(user.hash, payload.currentPassword);

    if (!pwMatches) throw new ForbiddenException('Wrong the past password');

    user.hash = await argon.hash(payload.newPassword);
    await this.userRepository.save(user);

    delete user.hash;
    delete user.refreshToken;

    return user;
  }

  async UpdateHeartService(
    dto: UpdateHeartDto,
    userCurrent: UserEntity,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        secretKey: userCurrent.secretKey,
        isDisplay: true,
      },
      relations: [
        'details',
        'cart',
        'cart.cartProducts',
        'cart.cartProducts',
        'cart.cartProducts.product',
        'cart.cartProducts.product.details',
        'cart.cartProducts.product.details.imgDisplay',
        'cart.cartProducts.product.details.brand',
        'cart.cartProducts.productVariant',
        'cart.cartProducts.productVariant.attributes',
      ],
    });

    if (!user) {
      throw new NotFoundException('The user does not exist!');
    }

    user.heart = dto.heart;

    const dataReturn = await this.userRepository.save(user);
    delete dataReturn.hash;
    delete dataReturn.refreshToken;
    return dataReturn;
  }
}
