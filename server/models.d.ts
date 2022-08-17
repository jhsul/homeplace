import { ObjectId } from "mongodb";

/*
export interface Board {
  _id: ObjectId;
  data: {
    x: number;
    y: number;

    color: string;

    history: ObjectId[];
  }[];
}
*/

export interface Pixel {
  _id: `${number},${number}`;

  color: string;

  history: ObjectId[];
}

export interface User {
  _id: ObjectId;
  username: string;

  latest: Date;

  history: ObjectId[];
}

export interface Placement {
  _id: ObjectId;

  username: string;

  x: number;
  y: number;

  color: number; // 0-15,  unsigned 4 bit integer

  date: Date;
}
