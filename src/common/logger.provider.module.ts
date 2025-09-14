import { Module, Global } from '@nestjs/common';
import pino from 'pino';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

@Global()
@Module({
  providers: [
    {
      provide: 'LOGGER',
      useValue: logger,
    },
  ],
  exports: ['LOGGER'],
})
export class LoggerProviderModule {}