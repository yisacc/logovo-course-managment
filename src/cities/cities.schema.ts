import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { CountryEntity } from '../countries/countries.schema';


@Schema()
@ObjectType()
export class CityEntity{
  @Prop({
    required: true,
    unique:true,
    index: true,
  })
  @Field()
  name: string;

  @Prop({
    required: true,
    index: true,
  })
  @Field()
  ascii_name: string;

  @Field()
  country_code: string;

  @Field(()=>[String])
  alternate_names: string[];

  @Prop({
    required: true,
    index: true,
    unique:true,

  })
  @Field()
  city_id: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    // ref: CountryEntity.name,
  })
  @Field(()=>CountryEntity )
  country: MongooseSchema.Types.ObjectId;
}

export const CityDatabaseName = 'cities';
export const CitySchema = SchemaFactory.createForClass(CityEntity);

export type CityDocument = CityEntity & Document;

