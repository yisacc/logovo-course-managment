import { Query, Resolver } from '@nestjs/graphql';
import { CountryEntity } from './countries.schema';
import { CountriesService } from './countries.service';

@Resolver(()=>CountryEntity)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Query(() => [CountryEntity], { name: 'countries' })
  async findAll():Promise<CountryEntity[]> {
    return (await this.countriesService.findAll());
  }
}
