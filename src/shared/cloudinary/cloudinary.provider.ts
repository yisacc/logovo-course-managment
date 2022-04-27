import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CLOUDINARY } from '../constants';

export const CloudinaryProvider = {

  provide: CLOUDINARY,
  useFactory: (): any => {
  let configService=new ConfigService()
    return v2.config({
      cloud_name: configService.get<string>('cloudinary.cloud_name'),
      api_key: configService.get<string>('cloudinary.api_key'),
    api_secret: configService.get<string>('cloudinary.api_secret'),
    });
  },
};
