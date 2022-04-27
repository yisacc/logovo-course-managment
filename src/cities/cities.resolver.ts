import { Args, Query, Resolver } from '@nestjs/graphql';
import { CityEntity } from './cities.schema';
import { CitiesService } from './cities.service';

@Resolver()
export class CitiesResolver {
  constructor(private readonly citiesService: CitiesService) {}

  @Query(() => [CityEntity], { name: 'cities' })
  async findAll():Promise<CityEntity[]> {
    return (await this.citiesService.findAll());
  }

  @Query(() => [CityEntity], { name: 'citiesByCountryId' })
  async findByCourseId(@Args('countryId', { type: () => Number }) id: number):Promise<CityEntity[]> {
    return await this.citiesService.findByCountryId(id);
  }
}
