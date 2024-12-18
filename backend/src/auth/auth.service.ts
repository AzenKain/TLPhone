import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDetailEntity, UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';
import { ForgetPasswordDto, LoginDto, SignUpDto, ValidateOtpDto } from './dto';
import * as argon from 'argon2';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { JwtPayload } from './interfaces';
import { CartService } from '../cart/cart.service';
import { OtpEntity } from '../types/otp';
import { MailerService } from '@nestjs-modules/mailer';
import * as OTPAuth from 'otpauth';
import * as otpGenerator from 'otp-generator';
import { RequestType } from '../types/response.type';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private cart: CartService,
    private config: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private userDetailRepository: Repository<UserDetailEntity>,
    @InjectRepository(OtpEntity)
    private otpCodeRepository: Repository<OtpEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async validateUser(id: string, email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
        secretKey: id,
      },
      relations: ['details', 'cart', 'cart.cartProducts'],
    });
    if (user) {
      return user;
    }
    return null;
  }

  async validateJwtPayload(payload: JwtPayload): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        email: payload.email,
        secretKey: payload.id,
      },
      relations: ['details', 'cart', 'cart.cartProducts'],
    });
    if (user) {
      return user;
    }
    return null;
  }

  async LoginService(dto: LoginDto) {
    const userLogin = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });
    if (!userLogin) throw new ForbiddenException('This user does not exist');
    if (userLogin.role.includes('INACTIVE')) {
      throw new ForbiddenException(`This user had INACTIVE`);
    }
    const pwMatches = await argon.verify(userLogin.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException('Wrong password');
    const token = await this.signToken(userLogin.secretKey, userLogin.email);
    await this.updateRefreshToken(userLogin.secretKey, token.refresh_token);
    return token;
  }

  async RefreshService(dto: JwtPayload) {
    const userLogin = await this.userRepository.findOne({
      where: {
        email: dto.email,
        secretKey: dto.id,
      },
    });
    if (!userLogin) throw new ForbiddenException('This user does not exist');

    if (userLogin.role.includes('INACTIVE')) {
      throw new ForbiddenException(`This user had INACTIVE`);
    }
    const token = await this.signToken(userLogin.secretKey, userLogin.email);
    await this.updateRefreshToken(userLogin.secretKey, token.refresh_token);
    return token;
  }
  async SignupService(dto: SignUpDto) {
    const genderType = ['MALE', 'FEMALE', 'OTHER'];
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
    const dataOtp = await this.otpCodeRepository.findOne({
      where: {
        id: dto.otpId,
        email: dto.email,
        type: "SignUp",
        value: true,
        isDisplay: false
      }
    })

    if (!dataOtp) {
      throw new ForbiddenException(
        'The user have not OTP CODE',
      );
    }

    const hash = await argon.hash(dto.password);

    const userDetail = this.userDetailRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
    });

    const savedUserDetail = await this.userDetailRepository.save(userDetail);

    const newCart = await this.cart.CreateCart();
    const UserCre = this.userRepository.create({
      secretKey: uuidv5(dto.email, uuidv5.URL),
      email: dto.email,
      hash: hash,
      refreshToken: uuidv4(),
      details: savedUserDetail,
      role: ['USER'],
      heart: [],
      cart: newCart,
    });
    const newUser = await this.userRepository.save(UserCre);
    const token = await this.signToken(newUser.secretKey, newUser.email);
    await this.updateRefreshToken(newUser.secretKey, token.refresh_token);
    return token;
  }

  async signToken(
    id: string,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const accessToken = await this.jwt.signAsync(
      {
        id: id,
        email,
      },
      {
        expiresIn: '2h',
        secret: this.config.get('JWT_SECRET'),
      },
    );

    const refreshToken = await this.jwt.signAsync(
      {
        id: id,
        email,
      },
      {
        expiresIn: '15d',
        secret: this.config.get('JWT_REFRESH_SECRET'),
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: {
        secretKey: userId,
      },
    });
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  }
  async createOtpService(dto: ValidateOtpDto) {
    const otpType = ['ForgotPassword', 'SignUp'];
    if (!otpType.includes(dto.type)) {
      throw new ForbiddenException('This type does not exist');
    }
    const dataOtp = await this.otpCodeRepository.findOne({
      where: {
        email: dto.type,
        isDisplay: true,
        type: dto.type,
      },
    });

    if (dataOtp) {
      const currentDate: Date = new Date();
      const thirtySecond = 60 * 1000;

      const isWithin30s =
        Math.abs(+new Date(dataOtp.created_at) - +currentDate) <= thirtySecond;

      if (!isWithin30s) {
        throw new ForbiddenException('Still counting down the time');
      }
    }

    const generatedOTP: string = otpGenerator.generate(6, {
      digits: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const totp = new OTPAuth.TOTP({
      algorithm: 'SHA224',
      digits: 6,
      secret: generatedOTP,
    });

    const token: string = totp.generate().toString();

    const newOtp = this.otpCodeRepository.create({
      email: dto.email,
      otpCode: token,
      isDisplay: true,
      value: false,
      type: dto.type,
    })

    await this.otpCodeRepository.save(newOtp)

    if (dto.type == 'ForgotPassword') {
      const user = await this.userRepository.findOne({
        where: {
          email: dto.email,
        },
        relations: [
          'details',
          'cart',
          'cart.cartProducts'
        ]
      });

      if (!user) throw new ForbiddenException(`This user does not exist`);

      if (user.role.includes('INACTIVE')) {
        throw new ForbiddenException(`This user had INACTIVE`);
      }
      delete user.hash;
      delete user.refreshToken;
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Otp Forget Password TLPhone',
        template: 'forgetPassword',
        context: {
          username: `${user.details.firstName} ${user.details.lastName}`,
          code: token,
        },
      });

      return { isRequest: true } as RequestType;

    }
    else if (dto.type == 'SignUp') {
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Otp Create Account TLPhone',
        template: 'createAccount',
        context: {
          code: token,
        },
      });
      return { isRequest: true } as RequestType;
    }
    return { isRequest: false } as RequestType;
  }
  async validateOtpService(dto: ValidateOtpDto) {
    const dataOtp = await this.otpCodeRepository.findOne({
      where: {
        email: dto.email,
        isDisplay: true,
        type: dto.type,
        otpCode: dto.otpCode,
        value: false,
      },
    });

    if (!dataOtp) {
      throw new ForbiddenException('The user have not OTP CODE');
    }
    dataOtp.value = true;
    dataOtp.isDisplay = false;
    await this.otpCodeRepository.save(dataOtp);
    return { isRequest: true, otpId: dataOtp.id } as RequestType;
  }

  async forgotPasswordService(dto: ForgetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException(`This email does not exist`);
    if (user.role.includes('INACTIVE')) {
      throw new ForbiddenException(`This user had INACTIVE`);
    }
    const dataOtp = await this.otpCodeRepository.findOne({
      where: {
        id: dto.otpId,
        email: dto.email,
        type: 'ForgotPassword',
        value: true,
        isDisplay: false,
      },
    });

    if (!dataOtp) {
      throw new ForbiddenException('The user have not OTP CODE');
    }

    if (dataOtp.value == false) {
      throw new ForbiddenException('Otp not validate');
    }

    await this.otpCodeRepository.save(dataOtp);

    user.hash = await argon.hash(dto.password);
    await this.userRepository.save(user);
    delete user.hash
    delete user.refreshToken
    return { isRequest: true } as RequestType;
  }
}
