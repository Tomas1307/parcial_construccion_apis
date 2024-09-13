/* eslint-disable prettier/prettier */
import { SocioEntity } from '../../socio/socio.entity/socio.entity';
import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClubEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string

    @Column()
    foundationDate: Date;

    @Column()
    image: string;

    @Column({ type: 'varchar', length: 100 })
    description: string;

    @ManyToMany(() => SocioEntity,(socio) => socio.clubs)
    @JoinTable()
    socios: SocioEntity[];

}


