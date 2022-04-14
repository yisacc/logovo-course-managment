import { Module } from '@nestjs/common';
import { DebuggerService } from 'src/shared/debugger/debugger.service';

@Module({
    providers: [DebuggerService],
    exports: [DebuggerService],
    imports: [],
})
export class DebuggerModule {}
