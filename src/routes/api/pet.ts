import { Response, Router } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Pet from "../../models/Pet";
import { IPet, TPet } from "../../models/Pet";
import Request from "../../types/Request";
import Shelter from "../../models/Shelter";

const router: Router = Router();

// @route   POST api/pet
// @desc    Create an pet
// @access  Private
router.post(
    "/",
    [
        auth,
        check("name", "Name is required").not().isEmpty(),
        check("breed", "Breed is required").not().isEmpty(),
        check("type", "Type is required").not().isEmpty(),
        check("age", "Age is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
        check("shelterId", "Shelter is required"),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ errors: errors.array() });
        }

        const { name, breed, type, age, description, shelterId } = req.body;

        // Build pet object based on TPet
        const petFields: TPet = {
            name,
            breed,
            type,
            age,
            description,
            date: new Date(),
        };

        if (shelterId) {
            try {
                petFields.shelter = await Shelter.findOne({_id: shelterId});
            } catch (err) {
                console.error(err.message);
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
            }
        }

        try {
            let pet: IPet = new Pet(petFields);
            await pet.save();

            console.log(await Pet.findOne({_id: pet._id}));


            res.json(pet);
        } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
);

// @route   PATCH api/pet/:petId
// @desc    Update an pet
// @access  Private
router.patch(
    "/:petId",
    [
        auth,
        check("name", "Name is required"),
        check("breed", "Breed is required"),
        check("age", "Age is required"),
        check("description", "Description is required"),
    ],
    async (req: Request, res: Response) => {
        const { name, breed, age, description } = req.body;
        const { petId } = req.params;

        try {
            let pet: IPet = await Pet.findOne({ _id: petId });

            if (!pet) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({
                    errors: [
                        {
                            msg: "Pet does not exist",
                        },
                    ],
                });
            }

            pet.name = name ?? pet.name;
            pet.breed = breed ?? pet.breed;
            pet.age = age ?? pet.age;
            pet.description = description ?? pet.description;
            pet.shelter = await Shelter.findOne({ _id: pet.shelter });

            await pet.save();

            res.json(pet);
        } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
);

// @route   GET api/pet/:petId
// @desc    Get pet by petId
// @access  Public
router.get("/:petId", async (req: Request, res: Response) => {
    try {
        const pet: IPet = await Pet.findOne({
            _id: req.params.petId,
        });

        if (!pet)
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ msg: "Pet not found" });

        pet.shelter = await Shelter.findOne({_id: pet.shelter});

        res.json(pet);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ msg: "Pet not found" });
        }
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   DELETE api/pet/:petId
// @desc    Delete pet by petId
// @access  Private
router.delete("/:petId", auth, async (req: Request, res: Response) => {
    try {
        // Remove pet
        await Pet.findOneAndRemove({ _id: req.params.petId });

        res.json({ msg: "Pet removed" });
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   GET api/pet/all
// @desc    Get all pets
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
    try {
        const pets: IPet[] = await Pet.find();
        res.json(pets);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   GET api/pets/shelter/:shelterId
// @desc    Get all pets by shelterId
// @access  Public
router.get("/shelter/:shelterId", async (req: Request, res: Response) => {
    try {
        const pets: IPet[] = await Pet.find({
            shelter: req.params.shelterId,
        });
        res.json(pets);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

export default router;
