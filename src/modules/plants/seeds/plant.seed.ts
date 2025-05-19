import { PlantModel } from '../models/plant.model';

export type PlantModelSeedData = {
  plant: Partial<PlantModel>;
};

export const BuildPlantModelSeedData = async (): Promise<
  PlantModelSeedData[]
> => {
  return [
    {
      plant: {
        name: 'Spider Plant',
        userId: 1,
        species: '',
        imageUrls: [],
        location: 'Kitchen shelf',
        waterIntervalDays: 5,
        reminderEnabled: true,
        archived: false,
        tags: ["Megan's Plants"],
      },
    },
    {
      plant: {
        name: 'Cactus',
        userId: 1,
        species: '',
        imageUrls: [],
        location: 'Office',
        waterIntervalDays: 14,
        reminderEnabled: true,
        archived: false,
        tags: ["Megan's Plants"],
      },
    },
    // {
    //   plant: {
    //     name: '',
    //   },
    // },
  ];
};
