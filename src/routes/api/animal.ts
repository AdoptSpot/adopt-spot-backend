import {Response, Router} from "express";
import {check, validationResult} from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Animal from "../../models/Animal";
import {IAnimal, TAnimal} from "../../models/Animal";
import Request from "../../types/Request";
import Shelter from "../../models/Shelter";

const router: Router = Router();

// @route   POST api/animal
// @desc    Create an animal
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

        // Build animal object based on TAnimal
        const animalFields: TAnimal = {
            name,
            breed,
            type,
            age,
            description,
            date: new Date(),
        };

        if (shelterId) {
            try {
                animalFields.shelter = await Shelter.findOne({_id: shelterId});
            } catch (err) {
                console.error(err.message);
                res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
            }
        }

        try {
            let animal: IAnimal = new Animal(animalFields);
            await animal.save();

            console.log(await Animal.findOne({_id: animal._id}));


            res.json(animal);
        } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
);

// @route   PATCH api/animal/:animalId
// @desc    Update an animal
// @access  Private
router.patch(
    "/:animalId",
    [
        auth,
        check("name", "Name is required"),
        check("breed", "Breed is required"),
        check("age", "Age is required"),
        check("description", "Description is required"),
    ],
    async (req: Request, res: Response) => {
        const { name, breed, age, description } = req.body;
        const { animalId } = req.params;

        try {
            let animal: IAnimal = await Animal.findOne({ _id: animalId });

            if (!animal) {
                return res.status(HttpStatusCodes.BAD_REQUEST).json({
                    errors: [
                        {
                            msg: "Animal does not exist",
                        },
                    ],
                });
            }

            animal.name = name ?? animal.name;
            animal.breed = breed ?? animal.breed;
            animal.age = age ?? animal.age;
            animal.description = description ?? animal.description;

            await animal.save();

            res.json(animal);
        } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
);

// @route   GET api/animal/:animalId
// @desc    Get animal by animalId
// @access  Public
router.get("/:animalId", async (req: Request, res: Response) => {
    try {
        const animal: IAnimal = await Animal.findOne({
            _id: req.params.animalId,
        });

        if (!animal)
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ msg: "Animal not found" });

        res.json(animal);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ msg: "Animal not found" });
        }
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   DELETE api/animal/:animalId
// @desc    Delete animal by animalId
// @access  Private
router.delete("/:animalId", auth, async (req: Request, res: Response) => {
    try {
        // Remove animal
        await Animal.findOneAndRemove({ _id: req.params.animalId });

        res.json({ msg: "Animal removed" });
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   GET api/animal/all
// @desc    Get all animals
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
    try {
        const animals: IAnimal[] = await Animal.find();
        res.json(animals);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   GET api/animals/shelter/:shelterId
// @desc    Get all animals by shelterId
// @access  Public
router.get("/shelter/:shelterId", async (req: Request, res: Response) => {
    try {
        const animals: IAnimal[] = await Animal.find({
            shelter: req.params.shelterId,
        });
        res.json(animals);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

export default router;
