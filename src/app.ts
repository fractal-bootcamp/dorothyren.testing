import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import { router as userRoutes } from "./routes/user.routes";
import client from "./lib/client";

const app: Application = express();

app.use("/users", userRoutes);


//GET request to search for all movies
app.get('/movies', async (req, res) => {
    const search = req.query.title as string | undefined;
    if (!search) {
        const movies = await client.movie.findMany()
        return res.send(movies)
    }

    const movies = await client.movie.findMany({
        where: {
            title: {
                contains: search
            }
        }
    })
    return res.send(movies)
})


//GET req to search for movies by id
app.get('/movies/:id', async (req, res) => {
    const id = req.params.id // get me from the request params using express (look this up if you don't know how)

    const movieById = await client.movie.findUnique({
        where: {
            id: id,
        },
    })

    res.send(movieById)
})

export default app;