import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesResolver } from './cities.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { CityDatabaseName, CityEntity, CitySchema } from './cities.schema';
import {
  CountryDatabaseName,
  CountryEntity,
  CountrySchema,
} from '../countries/countries.schema';

@Module({
  providers: [CitiesService, CitiesResolver],
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CityEntity.name,
          schema: CitySchema,
          collection: CityDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
    MongooseModule.forFeature(
      [
        {
          name: CountryEntity.name,
          schema: CountrySchema,
          collection: CountryDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
})
export class CitiesModule {}
