import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { Tokens } from './types/token.type';
import { SigninDto } from './dto/signin.dto';
import { Public } from '../common/decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Patch('/signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() dto: SignupDto): Promise<Tokens> {
        return await this.authService.signup(dto)
    }

    @Public()
    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() dto: SigninDto, @Res({ passthrough: true }) response: Response) {
        const data = await this.authService.signin(dto)
        const tokens = data.tokens;
        const id = data.id;
        response.cookie('jwt', tokens, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        response.cookie('id', id, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return tokens;
    }

    @Public()
    @Get('/signout')
    @HttpCode(HttpStatus.OK)
    async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const cookies = request.cookies
        if (!cookies?.id) return response.sendStatus(401);
        const user = cookies.id;
        await this.authService.logout(user)
        response.cookie('id', '', { expires: new Date() })
        response.cookie('jwt', '', { expires: new Date() })
    }

    @Get('/refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const cookies = request.cookies
        if (!cookies?.jwt) return response.sendStatus(401);
        const tokens = cookies.jwt;
        const id = cookies.id
        const token = await this.authService.refresh(tokens['refreshToken'], id)
        return token
    }

    @Patch('/:id')
    @HttpCode(HttpStatus.OK)
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return await this.authService.updateUser(id, dto)
    }

    @Public()
    @Get('/user')
    @HttpCode(HttpStatus.OK)
    async getUser(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const cookies = request.cookies;
        if (!cookies?.id) return response.sendStatus(401);
        const id = cookies.id;
        const user = await this.authService.getUser(id);
        return user
    }

} 
 