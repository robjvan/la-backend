import { LOGGING_REPOSITORY } from 'src/constants';
import { LogRecord } from './models/log-record.model';

export const loggingProviders = [
  {
    provide: LOGGING_REPOSITORY,
    useValue: LogRecord,
  },
];
