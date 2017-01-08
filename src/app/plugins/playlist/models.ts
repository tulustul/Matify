// import {
//   Table,
//   Column,
//   PrimaryGeneratedColumn,
// } from 'typeorm';

// @Table()
// export class Track {

//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     name: string;

//     @Column()
//     uri: string;
// }

export interface Track {
  name: string,
  uri: string,
}
