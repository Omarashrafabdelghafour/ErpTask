import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/DTO/user.dto';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(userDto: UserDto) {
    const email = userDto.email;

    
    const isUserInDb = await this.userModel.findOne({ email });

    if (isUserInDb) {
      return "User already exists";
    }
    let hashpass= await bcrypt.hash(userDto.password, 10); 
    userDto.password=hashpass;
    const user = new this.userModel(userDto);
    return await user.save(); 
  }


    async login(userDto: UserDto) {
        const email = userDto.email;
        const password = userDto.password;
        const user = await this.userModel.findOne({ email });
        if (!user) {
          return "User not found";
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return "Invalid password";
        }
const payload = { email: user.email, role: user.role, id: user._id };
const secretKey = process.env.SECRET_KEY;
const expiresIn = process.env.secret_key_expire;

if (!secretKey || !expiresIn) {
  throw new Error('JWT secret key or expiration is not defined in environment variables');
}

const token = jwt.sign(payload, secretKey, { expiresIn });
return {
  message: "Login successful",
  token: token,
  email: user.email,


         }
        }
}
