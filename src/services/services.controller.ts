import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { editFileName } from '../utils/file-uploading.utils';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) { }
  @Get()
  async index(@Res() res: Response) {
    const services = await this.servicesService.findAll()
    return res.status(200).json(services)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './files/services',
      filename: editFileName
    })
  }))
  async create(@Body() createServiceDto: CreateServiceDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    ) file: Express.Multer.File) {
    const completeImagePath = file ? `files/services/${file.filename}` : null

    return await this.servicesService.create({
      name: createServiceDto.name,
      description: createServiceDto.description,
      durationInMinutes: Number(createServiceDto.durationInMinutes),
      value: Number(createServiceDto.value)
    }, completeImagePath)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id, @Res() res: Response) {
    await this.servicesService.delete(id)
    return res.status(204).send()
  }
}
