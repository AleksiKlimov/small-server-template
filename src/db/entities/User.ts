import { Entity, Column, PrimaryGeneratedColumn, AfterLoad, OneToOne, JoinColumn } from 'typeorm';

import Basket from './Basket';

import config from '../../config';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  fullName: string;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  // @OneToOne(() => Basket)
  // @JoinColumn()
  // profile: Basket;

  @AfterLoad()
  changePath() {
    this.avatar = `${config.urls.current}/${this.avatar}`;
  }
}

export default User;
