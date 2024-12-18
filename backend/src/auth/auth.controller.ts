import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtGuardRestApiRefresh } from './guard';
import { AuthService } from './auth.service';
import { ForgetPasswordDto, LoginDto, SignUpDto, ValidateOtpDto } from './dto';
import { CurrentUserRest } from 'src/decorators';
import { UserEntity } from 'src/types/user';
import { JwtPayload } from './interfaces';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ){}

    @Post('login')
    async LoginController(
        @Body() dto : LoginDto,
    ) {
        return await this.authService.LoginService(dto)
    }


    @Post('signup')
    async SignUpController(
        @Body() dto : SignUpDto,
    ) {
        return await this.authService.SignupService(dto)
    }
    
    @UseGuards(JwtGuardRestApiRefresh)
    @Post('refresh')
    async RefreshController(
        @CurrentUserRest() user: JwtPayload
    ) {
        return await this.authService.RefreshService(user)
    }

    @Post('create-otp')
    async CreateOtpController(
      @Body() dto : ValidateOtpDto,
    ) {
        return await this.authService.createOtpService(dto)
    }

    @Post('validate-otp')
    async ValidateOtpController(
      @Body() dto : ValidateOtpDto,
    ) {
        return await this.authService.validateOtpService(dto)
    }

    @Post('forget-password')
    async forgetPasswordController(
      @Body() dto : ForgetPasswordDto,
    ) {
        return await this.authService.forgotPasswordService(dto)
    }
}
