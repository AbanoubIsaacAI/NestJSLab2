import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) { }

    /* async signUp(signUpDto: SignUpDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        const user = new this.userModel({ ...signUpDto, password: hashedPassword });
        return user.save();
    } */
    async signUp(signUpDto: SignUpDto): Promise<{ message: string; user: Partial<User> }> {
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        const user = new this.userModel({ ...signUpDto, password: hashedPassword });
        const savedUser = await user.save();

        const { password, ...result } = savedUser.toObject();
        return {
            message: 'User registered successfully',
            user: result,
        };
    }

    async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
        const user = await this.userModel.findOne({ email: signInDto.email });
        if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user._id };
        const token = await this.jwtService.signAsync(payload);
        return { accessToken: token };
    }

    async getProfile(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async getAllOtherUsers(userId: string): Promise<User[]> {
        return this.userModel.find({ _id: { $ne: userId } }).select('-password');
    }
}
