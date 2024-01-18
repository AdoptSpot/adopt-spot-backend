import Pet from "../models/Pet";
import pets from "./pets.json";

const populateDB = async () => {
    try {
        await Pet.deleteMany({});
        await Pet.insertMany(pets);
        console.log("Pets populated");
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

export default populateDB;