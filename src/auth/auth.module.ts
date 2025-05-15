import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            secret: 'your_jwt_secret',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule { }