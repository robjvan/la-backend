import { PLANT_REPOSITORY } from 'src/constants';
import { PlantModel } from './models/plant.model';

export const plantsProviders = [
  {
    provide: PLANT_REPOSITORY,
    useValue: PlantModel,
  },
];
