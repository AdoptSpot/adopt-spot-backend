import { Document, model, Schema } from "mongoose";
import { IShelter } from "./Shelter";

/**
 * Type to model the Animal Schema for TypeScript.
 * @param name:string
 * @param type:string
 * @param breed:string
 * @param age:number
 * @param description:string
 * @param shelter:ref => Shelter._id
 * @param date:Date
 */

export type TAnimal = {
    name: string;
    type: string;
    breed: string;
    age: number;
    description: string;
    shelter?: IShelter["_id"]
    date: Date;
};

/**
 * Mongoose Document based on TProfile for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TAnimal
 * @param name:string
 * @param type:string
 * @param breed:string
 * @param age:number
 * @param description:string
 * @param shelter:ref => Shelter._id
 * @param date:Date
 */

export interface IAnimal extends TAnimal, Document {}

const animalSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "Dog",
    },
    breed: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    shelter: {
        type: Schema.Types.ObjectId,
        ref: "Shelter",
    },
    date: {
        type: String,
        default: Date.now,
    },
});

/**
 * Mongoose Model based on TProfile for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TAnimal
 * @param name:string
 * @param type:string
 * @param breed:string
 * @param age:number
 * @param description:string
 * @param shelter:ref => Shelter._id
 * @param date:Date
 */

const Animal = model<IAnimal>("Animal", animalSchema);

export default Animal;
