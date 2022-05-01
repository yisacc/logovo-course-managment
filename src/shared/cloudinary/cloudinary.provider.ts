import { v2 } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { CLOUDINARY } from '../constants/cloudinary';
import { ApiConfigService } from '../config/cloudinary.config';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): any => {
    const configService = new ConfigService();
    const apiConfigService = new ApiConfigService(configService);
    return v2.config({
      cloud_name: apiConfigService.cloudinaryConfig.cloudName,
      api_key: apiConfigService.cloudinaryConfig.apiKey,
      api_secret: apiConfigService.cloudinaryConfig.apiSecret,
    });
  },
};
