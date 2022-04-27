import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesResolver } from './countries.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CityDatabaseName, CityEntity, CitySchema } from '../cities/cities.schema';
import { DATABASE_CONNECTION_NAME } from '../shared/database/database.constant';
import { CountryDatabaseName, CountryEntity, CountrySchema } from './countries.schema';

@Module({
  providers: [CountriesService, CountriesResolver],
  imports:[MongooseModule.forFeature(
    [
      {
        name: CityEntity.name,
        schema: CitySchema,
        collection: CityDatabaseName,
      },
    ],
    DATABASE_CONNECTION_NAME
  ),
    MongooseModule.forFeature(
      [
        {
          name: CountryEntity.name,
          schema: CountrySchema,
          collection: CountryDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME
    )
  ]
})
export class CountriesModule {}
