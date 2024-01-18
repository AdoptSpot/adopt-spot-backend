import Pet from "../models/Pet";
import Shelter from "../models/Shelter";
import pets from "./pets.json";
import shelters from "./shelters.json";

const populateDB = async () => {
    // if the database is already populated, do nothing
    if (await Pet.countDocuments() > 0 && await Shelter.countDocuments() > 0) {
        return;
    }

    try {
        await Pet.deleteMany({});
        await Pet.insertMany(pets);
        console.log("Pets populated");

        await Shelter.deleteMany({});
        await Shelter.insertMany(shelters);
        console.log("Shelters populated");

        // take the shelters ids and add them randomly to 8 pets
        const shelterIds = await Shelter.find().select("_id");
        const petIds = await Pet.find().select("_id");

        for (let i = 0; i < 8; i++) {
            await Pet.updateOne(
                { _id: petIds[i] },
                { $set: { shelter: shelterIds[Math.floor(Math.random() * shelterIds.length)] } }
            );
        }

    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

export default populateDB;