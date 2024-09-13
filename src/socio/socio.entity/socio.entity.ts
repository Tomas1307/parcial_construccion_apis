import { Entity,Column,PrimaryGeneratedColumn,ManyToMany, JoinTable } from "typeorm";
import { ClubEntity } from "../../club/club.entity/club.entity";

@Entity()
export class SocioEntity {

    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    birthdate: Date;

    @ManyToMany(() => ClubEntity,(club) => club.socios)
    @JoinTable()
    clubs: ClubEntity[];
    
}


