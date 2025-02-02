import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import * as bcrypt from 'bcrypt';
import { Roles, User } from '@prisma/client';
@Injectable()
export class UserService {

    constructor(private prisma:PrismaService){}

    //Login
    async login(username:string,password:string){

        const result = await this.getUser(username,password);
        if(result.role == Roles.Admin){
            const users =  await this.getAllUser();
            const admin = result;
            return {
                user:result,
                users:users
            }
        }else{
            return {
                user:result
            };
        }
    }

    //create User
    async createUser(userName:string,password:string,data:any){
        let admin;
        try {
            admin = await this.getUser(userName,password);
        } catch (error) {
            if(error instanceof NotFoundException){
                throw new UnauthorizedException("Admin not found");
            }else{
                throw error;
            }
        }
        if(admin.role != Roles.Admin){
            throw new UnauthorizedException("You are not allowed to create user");
        };

        const hashedPassword = await bcrypt.hash(data.password,12);
        data.password = hashedPassword;

        const result = await this.prisma.user.create({
            data:data
        });
        return {
            id:result.id,
            name:result.name,
            Roles:result.role,
            userName:result.username
        };
    }

    async getUser(username:string,password:string){
        const result = await this.prisma.user.findUnique({
            where:{
                username:username
            }
        });

        if(!result){
            throw new NotFoundException("User not found");
        }

        const isValid = await bcrypt.compare(password,result.password);

        if(!isValid){
            throw new UnauthorizedException("Invalid Credentials");
        }

        return {
            id:result.id,
            name:result.name,
            role:result.role,
            username:result.username
        };
    }

    async getAllUser(){
        return await this.prisma.user.findMany(
            {
                select:{
                    id:true,
                    name:true,
                    role:true,
                    username:true
                }
            }
        );
    }
}
