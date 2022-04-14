import { Module, Global } from '@nestjs/common';
import { MessageService } from 'src/shared/message/message.service';

@Global()
@Module({
    providers: [MessageService],
    exports: [MessageService],
    imports: [],
    controllers: [],
})
export class MessageModule {}
