import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { editFileName } from '../utils/file-uploading.utils';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalsService } from './professionals.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private professionalsService: ProfessionalsService) { }

  @Get()
  async index(@Res() res: Response) {
    const professionals = await this.professionalsService.findAll()
    return res.json(professionals)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './files/professionals',
      filename: editFileName
    })
  }))
  async create(@Body() createProfessionalDto: CreateProfessionalDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    ) file: Express.Multer.File) {
    const completeImagePath = file ? `files/professionals/${file.filename}` : null
    return this.professionalsService.create({
      name: createProfessionalDto.name,
      description: createProfessionalDto.description,
      commission: Number(createProfessionalDto.commission)
    }, completeImagePath)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id, @Res() res: Response) {
    await this.professionalsService.delete(id)
    return res.status(204).send()
  }

}
