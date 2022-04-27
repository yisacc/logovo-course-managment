import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CityDocument, CityEntity } from './cities.schema';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(CityEntity.name)
    private readonly cityModel: Model<CityDocument>
  ){}

  async findAll(
  ): Promise<CityEntity[]> {
    return this.cityModel.find();
  }

  async findByCountryId(id:Number):Promise<CityDocument[]> {
    return this.cityModel.find({$country:{$country_id:id}})
  }
}
