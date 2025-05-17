import { PlantModel } from '../models/plant.model';

export type PlantModelSeedData = {
  plant: Partial<PlantModel>;
};

export const BuildPlantModelSeedData = async (): Promise<
  PlantModelSeedData[]
> => {
  return [
    // {
    //   plant: {
    //     name: '',
    //   },
    // },
    // {
    //   plant: {
    //     name: '',
    //   },
    // },
  ];
};
