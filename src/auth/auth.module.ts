import { Module,forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'my-secret-key', // Store securely in environment variables
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UsersModule)
  ],
  providers: [JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
