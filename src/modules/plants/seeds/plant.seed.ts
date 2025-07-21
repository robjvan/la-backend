import { PlantModel } from '../models/plant.model';
import * as dayjs from 'dayjs';

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
        lastWateredAt: dayjs(Date.now()).subtract(7, 'day').toDate(),
        archived: false,
        tags: ["Megan's Plants"],
        notes: ['test'],
        fertilizerReminderEnabled: false,
        fertilizerIntervalDays: 7,
        lastFertilizedAt: dayjs(Date.now()).subtract(9, 'day').toDate(),
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
