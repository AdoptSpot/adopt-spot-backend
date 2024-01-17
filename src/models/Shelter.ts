import { Document, model, Schema } from "mongoose";

/**
 * Type to model the Shelter Schema for TypeScript.
 * @param name:string
 * @param location:string
 * @param contact_email:string
 * @param contact_phone:string
 */

export type TShelter = {
    name: string;
    location: string;
    contact_email: string;
    contact_phone: string;
};

/**
 * Mongoose Document based on TShelter for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TShelter
 * @param name:string
 * @param location:string
 * @param contact_email:string
 * @param contact_phone:string
 */

export interface IShelter extends TShelter, Document {}

const shelterSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    contact_email: {
        type: String,
        required: true,
    },
    contact_phone: {
        type: String,
        required: true,
    }
});

/**
 * Mongoose Model based on TShelter for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TShelter
 * @param name:string
 * @param location:string
 * @param contact_email:string
 * @param contact_phone:string
 */

const Shelter = model<IShelter>("Shelter", shelterSchema);

export default Shelter;
