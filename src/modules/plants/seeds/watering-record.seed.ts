import { WateringRecordModel } from '../models/watering-record.model';
import * as dayjs from 'dayjs';

export type WateringRecordModelSeedData = {
  wateringRecord: Partial<WateringRecordModel>;
};

export const BuildWateringRecordModelSeedData = async (): Promise<
  WateringRecordModelSeedData[]
> => {
  return [
    {
      wateringRecord: {
        createdAt: dayjs(Date.now()).subtract(7, 'day'),
        plantId: 1,
      },
    },
  ];
};
