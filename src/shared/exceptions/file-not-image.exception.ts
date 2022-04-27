import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class FileNotImageException extends BadRequestException {
  constructor(error?: string) {
    super('error.fileNotImage', error);
  }
}

export class FailedToUploadImage extends InternalServerErrorException {
  constructor(error?: string) {
    super('error.failed', error);
  }
}
