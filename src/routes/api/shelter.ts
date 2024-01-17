import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Shelter, { TShelter, IShelter } from "../../models/Shelter";
import Request from "../../types/Request";

const router: Router = Router();

// @route   POST api/shelter
// @desc    Create a shelter
// @access  Private
router.post(
    "/",
    [
        auth,
        check("name", "Name is required").not().isEmpty(),
        check("location", "Location is required").not().isEmpty(),
        check("contact_email", "Contact email is required").not().isEmpty(),
        check("contact_phone", "Contact phone is required").not().isEmpty(),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ errors: errors.array() });
        }

        const { name, location, contact_email, contact_phone } = req.body;

        // Build shelter object based on TShelter
        const shelterFields: TShelter = {
            name,
            location,
            contact_email,
            contact_phone,
        };

        try {
            let shelter = new Shelter(shelterFields);
            await shelter.save();

            res.json(shelter);
        } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
);

// @route   PATCH api/shelter/:shelterId
// @desc    Update a shelter
// @access  Private
router.patch(
    "/:shelterId",
    [
        auth,
        check("name", "Name is required"),
        check("location", "Location is required"),
        check("contact_email", "Contact email is required"),
        check("contact_phone", "Contact phone is required"),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ errors: errors.array() });
        }

        const { name, location, contact_email, contact_phone } = req.body;

        try {
            let shelter: IShelter = await Shelter.findById(req.params.shelterId);

            if (!shelter) {
                return res
                    .status(HttpStatusCodes.NOT_FOUND)
                    .json({ msg: "Shelter not found" });
            }

            const shelterFields: TShelter = {
                name: name ?? shelter.name,
                location: location ?? shelter.location,
                contact_email: contact_email ?? shelter.contact_email,
                contact_phone: contact_phone ?? shelter.contact_phone,
            };

            shelter = await Shelter.findByIdAndUpdate(
                req.params.shelterId,
                { $set: shelterFields },
                { new: true }
            );

            res.json(shelter);
        } catch (err) {
            console.error(err.message);
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        }
    }
);

// @route   GET api/shelter/:shelterId
// @desc    Get shelter by shelterId
// @access  Public
router.get("/:shelterId", async (req: Request, res: Response) => {
    try {
        const shelter: IShelter = await Shelter.findById(req.params.shelterId);

        if (!shelter)
            return res
                .status(HttpStatusCodes.BAD_REQUEST)
                .json({ msg: "Shelter not found" });

        res.json(shelter);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   GET api/shelter
// @desc    Get all shelters
// @access  Public
router.get("/", async (_req: Request, res: Response) => {
    try {
        const shelters: IShelter[] = await Shelter.find();

        res.json(shelters);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

// @route   DELETE api/shelter/:shelterId
// @desc    Delete a shelter
// @access  Private
router.delete("/:shelterId", auth, async (req: Request, res: Response) => {
    try {
        // Remove shelter
        await Shelter.findOneAndRemove({ _id: req.params.shelterId });

        res.json({ msg: "Shelter removed" });
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

export default router;
