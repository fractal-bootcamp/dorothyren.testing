import express, { Application, Request, Response, NextFunction } from "express";

import { router as userRoutes } from "./routes/user.routes";
import { Prisma, PrismaClient } from "@prisma/client";

const app: Application = express();

const prisma = new PrismaClient

app.use("/users", userRoutes);


app.get("/movies", async (req, res) => {
    const movies = await prisma.movie.findMany({
        where: {
            title: "fake title",
        },
    })
    res.send(movies)
})

export default app;