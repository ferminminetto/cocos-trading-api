
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'instruments' })
export class Instrument {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ticker: string;

    @Column()
    name: string;

    @Column()
    type: InstrumentType;
}

export enum InstrumentType {
    ASSET = 'ACCIONES',
    CURRENCY = 'MONEDA',
}