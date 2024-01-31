import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/users.schema';
import { constants } from './constants';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwt: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      constants.salt,
    );

    console.log(createUserDto);
    const user = await this.userService.create(createUserDto);

    const token = await this.generateTokens(user);

    return token;
  }

  async login(data: { email: string; password: string }) {
    const foundUser = await this.userService.findOne(data.email);
    if (!foundUser) {
      return new NotFoundException('Aucun utilisateur avec cet adresse mail.');
    }
    //console.log(foundUser);
    const hashPwd = await bcrypt.hash(data.password, constants.salt);
    if (await bcrypt.compare(foundUser?.password, hashPwd)) {
      throw new UnauthorizedException();
    }

    const token = await this.generateTokens(foundUser);

    return token;
  }

  async verify(token: string) {
    let user;
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: constants.secret,
      });
      user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    const foundUser = await this.userService.find(user.data.email);
    if (foundUser !== null) {
      return await this.generateTokens(user.data);
    } else {
      return new UnauthorizedException();
    }
  }

  private async generateTokens(user) {
    const payload = {
      sub: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      money: user.money,
    };

    return {
      access: await this.jwt.signAsync({
        exp: Math.floor(Date.now() / 1000) + 600,
        data: payload,
      }),
      verify: await this.jwt.signAsync({
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        data: payload,
      }),
    };
  }
}
