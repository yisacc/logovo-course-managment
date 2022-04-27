import { registerAs } from '@nestjs/config';

export default () => ({
  cloudinary: {
    cloud_name: process.env.cloudName,
    api_key: process.env.apiKey,
    api_secret: process.env.apiSecret,
  }
});
