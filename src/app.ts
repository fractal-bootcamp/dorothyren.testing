import express, { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

import { router as userRoutes } from "./routes/user.routes";
import client from "./lib/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const app: Application = express();

app.use(express.json())

app.use("/users", userRoutes);


//GET request to search for all movies
app.get('/movies', async (req, res) => {
    const search = req.query.title as string | undefined;
    if (!search) {
        const movies = await client.movie.findMany()
        console.log(movies)
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

//POST req to add tags to a movie
app.post('/movies/:movieId/tag', async (req, res) => {
    const movieId = req.params.movieId
    const tagText = req.body.tagText

    const newTag = await client.tag.create({
        data: {
            tagText: tagText,
            movieTags: {
                create: {
                    movieId
                }
            }
        }
    })
    res.send(newTag)
})


//PUT req to add a movie as a favorite
app.put('/movies/:movieId/favorites', async (req, res) => {
    const movieId = req.params.movieId
    const userId = req.body.userId

    // 1. check if the movie is already favorited by asking the DB.
    const checkFavorite = await client.favorite.findFirst({
        where: {
            userId: userId,
            movieId: movieId
        },
    })
    // 2. if it already exists, delete the favorite
    if (checkFavorite !== null) {
        const deleted = await client.favorite.delete({
            where: {
                movieId_userId: {
                    userId: userId,
                    movieId: movieId
                },
            }
        })
        return res.json("Favorite has been removed")
    }
    // 3. otherwise, make a new favorite
    else {
        const newFavorite = await client.favorite.create({
            data: {
                userId: userId,
                movieId: movieId
            },
        })
        return res.json(newFavorite)
    }
})

//get users favorite movies by userId
app.get('/:userId/favorites', async (req, res) => {
    const userId = req.params.userId

    const favorites = await client.favorite.findMany({
        where: {
            userId: userId
        }
    })
    return res.json(favorites)
})

export default app;

// try {
//     const favoritedMovie = await client.favorite.create({
//         data: {
//             userId: userId,
//             movieId: movieId,
//         }
//     })
// } catch (e) {
//     const favoritedMovie = null

// check if this is a unique constraint error
// if (e instanceof PrismaClientValidationError) {
//     // if it is, delete the favorite
//     const deleteFavorite = await client.favorite.delete({
//         where: {
//             movieId_userId: {
//                 movieId,
//                 userId
//             }
//         }
//     })
//     res.send("you have removed a favorite"),
//         console.log("did you receive the favorite deleted message?")
// }

