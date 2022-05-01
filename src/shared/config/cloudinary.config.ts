import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get cloudinaryConfig() {
    return {
      cloudName: this.getString('CLOUD_NAME'),
      apiKey: this.getString('API_KEY'),
      apiSecret: this.getString('API_SECRET'),
    };
  }
  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
