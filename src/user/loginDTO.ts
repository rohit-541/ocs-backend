import { Roles } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

export class loginDTO{
    @IsNotEmpty()
    @IsString()
    userName:string

    @IsNotEmpty()
    @IsString()
    password:string
}

export class createDTO{

    @IsNotEmpty()
    @IsString()
    adminUserName:string

    @IsNotEmpty()
    @IsString()
    adminPass:string


    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    username:string

    @IsNotEmpty()
    @IsString()
    password:string

    @IsNotEmpty()
    @IsEnum(Roles)
    role:string
}