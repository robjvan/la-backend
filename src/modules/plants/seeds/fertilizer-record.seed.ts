import * as dayjs from 'dayjs';
import { FertilizerRecordModel } from '../models/fertilizer-record.model';

export type FertilizerRecordModelSeedData = {
  fertilizerRecord: Partial<FertilizerRecordModel>;
};

export const BuildFertilizerRecordModelSeedData = async (): Promise<
  FertilizerRecordModelSeedData[]
> => {
  return [
    // {
    //   fertilizerRecord: {
    //     plantId: 1,
    //     createdAt: dayjs(Date.now()).subtract(6, 'day'),
    //     amount: '50g',
    //   },
    // },
  ];
};
