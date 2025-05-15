import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('sign-up')
    @ApiOperation({ summary: 'Register a new user' })
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.usersService.signUp(signUpDto);
    }

    @Post('sign-in')
    @ApiOperation({ summary: 'Login and get JWT token' })
    async signIn(@Body() signInDto: SignInDto) {
        return this.usersService.signIn(signInDto);
    }

    @Get('my-profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get your own profile' })
    async myProfile(@Req() req) {
        return this.usersService.getProfile(req.user.sub);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all other users' })
    async getOthers(@Req() req) {
        return this.usersService.getAllOtherUsers(req.user.sub);
    }
}
