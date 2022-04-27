import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CountryDocument, CountryEntity } from './countries.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(CountryEntity.name)
    private readonly countryModel: Model<CountryDocument>
  ){}

  async findAll(
  ): Promise<CountryEntity[]> {
    return this.countryModel.find();
  }

}
