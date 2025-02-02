import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import bcrypt from 'bcrypt'
import { Roles, User } from '@prisma/client';
@Injectable()
export class UserService {

    constructor(private prisma:PrismaService){}

    //Login
    async login(username:string,password:string){

        const result:User = await this.getUser(username,password);
        if(result.role == Roles.Admin){
            return await this.getAllUser();
        }else{
            return result;
        }
    }

    //create User
    async createUser(userName:string,password:string,data:any){

        const admin = await this.getUser(userName,password);
        if(admin.role != Roles.Admin){
            throw new UnauthorizedException("You are not allowed to create user");
        };

        const hashedPassword = await bcrypt.hash(data.password,12);
        data.password = hashedPassword;

        const result = await this.prisma.user.create(data);
        return result;
    }

    async getUser(username:string,password:string){
        const result = await this.prisma.user.findUnique({
            where:{
                username:username
            }
        });

        if(!result){
            throw new NotFoundException("User Not found");
        }

        const isValid = await bcrypt.compare(password,result.password);

        if(!isValid){
            throw new UnauthorizedException("Invalid Credentials");
        }

        return result;
    }

    async getAllUser(){
        return await this.prisma.user.findMany();
    }
}
