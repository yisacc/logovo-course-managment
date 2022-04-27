import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { CityEntity } from '../cities/cities.schema';


@Schema()
@ObjectType()
export class CountryEntity{
  @Prop({
    required: true,
    unique:true,
    index: true,
  })
  @Field()
  iso: string;

  @Prop({
    required: true,
    index: true,
  })
  @Field()
  country: string;


  @Field()
  capital: string;


  @Field()
  currency_code: string;


  @Field()
  currency_name: string;


  @Field()
  currency_symbol: string;


  @Field()
  phone: string;

  @Field()
  postal_code_format: string;

  @Field()
  postal_code_regex: string;

  @Field(()=>[String])
  languages: string[];

  @Prop({
    required: true,
    index: true,
    unique:true,

  })
  @Field()
  country_id: string;


  @Prop({
    required: true,
    type: [MongooseSchema.Types.ObjectId],
    // ref: CityEntity.name,
  })
  @Field(()=>[CityEntity] )
  cities: MongooseSchema.Types.ObjectId[];
}

export const CountryDatabaseName = 'countries';
export const CountrySchema = SchemaFactory.createForClass(CountryEntity);

export type CountryDocument = CountryEntity & Document;

