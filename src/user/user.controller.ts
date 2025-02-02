import { BadRequestException, Body, Controller, Get, HttpException, InternalServerErrorException, Post, ValidationPipe } from '@nestjs/common';
import { createDTO, loginDTO } from './loginDTO';
import { PrismaService } from 'src/prisma';
import { UserService } from './user.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('user')
export class UserController {

    constructor(private userService:UserService){}

    @Post('/')
    async login(@Body(new ValidationPipe({whitelist:true})) data:loginDTO){
        const {userName,password} = data;
        try {
            const result = await this.userService.login(userName,password);
            return{
                success:true,
                user:result
            }
        } catch (error) {
            if(error instanceof HttpException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }

    @Post('/create')
    async createNew(@Body(new ValidationPipe({whitelist:true})) data:createDTO){
        try {

            const {adminUserName,adminPass,...otherData} = data;

            const result = await this.userService.createUser(adminUserName,adminPass,otherData);
            return {
                success:true,
                user:result
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2025"){
                    throw new BadRequestException("UserName occupied please try different");
                }
            }

            if(error instanceof HttpException){
                throw error;
            }

            throw new InternalServerErrorException("Something went wrong");
        }
    }   

}
