import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {constants} from "./constants";

@Module({
  imports: [
      UsersModule,
      JwtModule.register({
        global: true,
        secret: constants.secret
      })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
