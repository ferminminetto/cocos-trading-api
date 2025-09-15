import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instrument } from './models/instrument.entity';
import { InstrumentController } from './instrument.controller';
import { InstrumentRepository } from './instrument.repository';
import { InstrumentService } from './instrument.service';

@Module({
  imports: [TypeOrmModule.forFeature([Instrument])],
  controllers: [InstrumentController],
  providers: [InstrumentService, InstrumentRepository],
  exports: [InstrumentService], 
})
export class InstrumentModule {}