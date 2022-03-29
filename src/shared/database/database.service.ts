import { Injectable } from '@nestjs/common';
import {
    MongooseOptionsFactory,
    MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';
@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
    private readonly host: string;
    private readonly database: string;
    private readonly user: string;
    private readonly password: string;
    private readonly srv: boolean;
    private readonly admin: boolean;
    private readonly ssl: boolean;
    private readonly debug: boolean;
    private readonly options: string;
    private readonly env: string;

    constructor(private readonly configService: ConfigService) {
        this.env = this.configService.get<string>('app.env');
        this.host = this.configService.get<string>('database.host');
        this.database = this.configService.get<string>('database.name');
        this.user = this.configService.get<string>('database.user');
        this.password = this.configService.get<string>('database.password');
        this.srv = this.configService.get<boolean>('database.srv');
        this.admin = this.configService.get<boolean>('database.admin');
        this.ssl = this.configService.get<boolean>('database.ssl');
        this.debug = this.configService.get<boolean>('database.debug');
        this.options = this.configService.get<string>('database.options')
            ? `?${this.configService.get<string>('database.options')}`
            : '';
    }

    createMongooseOptions(): MongooseModuleOptions {
        const uri = `mongodb${this.srv ? '+srv' : ''}://${this.user}:${this.password}${this.host}/`;

        if (this.env !== 'production') {
            mongoose.set('debug', this.debug);
        }

        const mongooseOptions: MongooseModuleOptions = {
            uri,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName:this.database,
        };

        if (this.admin) {
            mongooseOptions.authSource = 'admin';
        }

        if (this.ssl) {
            mongooseOptions.ssl = true;
        }
        return mongooseOptions;
    }
}
