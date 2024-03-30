import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({ message: 'Please Enter Type' })
    type: string;

    @IsString()
    @IsNotEmpty({ message: 'Please Enter Title' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Please Enter Description' })
    description: string;

    @IsString()
    @IsNotEmpty({ message: 'Please Enter Vendor' })
    vendor: string;
}