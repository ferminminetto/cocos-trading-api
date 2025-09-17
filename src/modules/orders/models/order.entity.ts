import { User } from '../../accounts/models/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'instrumentid', type: 'int', nullable: true })
  instrumentId!: number | null;

  @Column({ name: 'userid', type: 'int' })
  userId!: number;

  @Column({ name: 'size', type: 'int', nullable: true })
  size!: number | null;

  // numeric from pg comes as string in JS
  @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2, nullable: true })
  price!: string | null;

  @Column({ name: 'type', type: 'varchar', length: 10, nullable: true })
  type!: string | null;

  @Column({ name: 'side', type: 'varchar', length: 10 })
  side!: string;

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status!: string;

  @Column({ name: 'datetime', type: 'timestamp', nullable: true })
  datetime!: Date | null;

  @Column({ name: 'idempotence_key', type: 'varchar', nullable: true })
  idempotenceKey!: string | null;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  @JoinColumn({ name: 'userid' })
  user!: User;
}