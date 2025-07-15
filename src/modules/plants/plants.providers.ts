import {
  FERTILIZER_RECORDS_REPOSITORY,
  PLANT_REPOSITORY,
  WATERING_RECORDS_REPOSITORY,
} from 'src/constants';
import { PlantModel } from './models/plant.model';
import { WateringRecordModel } from './models/watering-record.model';
import { FertilizerRecordModel } from './models/fertilizer-record.model';

export const plantsProviders = [
  {
    provide: PLANT_REPOSITORY,
    useValue: PlantModel,
  },
  {
    provide: WATERING_RECORDS_REPOSITORY,
    useValue: WateringRecordModel,
  },
  {
    provide: FERTILIZER_RECORDS_REPOSITORY,
    useValue: FertilizerRecordModel,
  },
];
