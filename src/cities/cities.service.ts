import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryDocument, CountryEntity } from 'src/countries/countries.schema';
import { CityDocument, CityEntity } from './cities.schema';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(CityEntity.name)
    private readonly cityModel: Model<CityDocument>,
    @InjectModel(CountryEntity.name)
    private readonly countryModel: Model<CountryDocument>,
  ) {}

  async findAll(): Promise<CityEntity[]> {
    return this.cityModel.find();
  }

  async findByCountryId(id: string): Promise<CityDocument[]> {
    const ObjectId = require('mongoose').Types.ObjectId;
    const country = await this.countryModel.findOne(new ObjectId(id));
    return this.cityModel.find({
      $country: { $country_id: country.country_id },
    });
  }
}
