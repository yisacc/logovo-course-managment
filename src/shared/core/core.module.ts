import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import Configs from '../config/index';
import { DATABASE_CONNECTION_NAME } from '../database/database.constant';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { DebuggerModule } from '../debugger/debugger.module';
import { HelperModule } from '../helper/helper.module';
import { AuthModule } from '../../auth/auth.module';
import { WinstonModule } from 'nest-winston';
import { DebuggerService } from '../debugger/debugger.service';
import { MessageModule } from '../message/message.module';

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            load: Configs,
            ignoreEnvFile: false,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
        }),
        WinstonModule.forRootAsync({
            inject: [DebuggerService],
            imports: [DebuggerModule],
            useFactory: (loggerService: DebuggerService) =>
              loggerService.createLogger(),
        }),
        MongooseModule.forRootAsync({
            connectionName: DATABASE_CONNECTION_NAME,
            inject: [DatabaseService],
            imports: [DatabaseModule],
            useFactory: (databaseService: DatabaseService) =>
                databaseService.createMongooseOptions(),
        }),
        MessageModule,
        DebuggerModule,
        HelperModule,
        AuthModule,
    ],
})
export class CoreModule {}
