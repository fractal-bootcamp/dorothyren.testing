import supertest from "supertest";

// now we can import express (and prisma client)
import app from "../app";

// import { prismaMock } from "../lib/singleton";

const fakeMovie = {
    id: "345897",
    title: "Fakery",
    description: "The phoniest movie ever",
}

const newMovie = {
    id: "5645645",
    title: "New Movie",
    description: "I'm new",
}

const fakeMovies = [
    fakeMovie,
    newMovie,
    {
        id: "3453453",
        title: "The Craziest Movie Ever",
        description: "super super crazy",
    },
]

describe("Our five movie api routes", () => {

    test.skip("Get movies", async () => {
        // mocking the return value of prisma movies
        // prismaMock.movie.findMany.mockResolvedValue(fakeMovies)

        //make a get request to movies 
        const movieRes = await supertest(app).get("/movies");

        //todo: insert some actual data to test
        expect(movieRes.status).toEqual(200)
        expect(movieRes.body).toEqual(fakeMovies)

    })

    // todo - don't skip me
    test.skip("Search Movies", async () => {
        type PrismaPayload = {
            where: {
                title: {
                    contains: string
                }
            }
        }
        /** @ts-ignore */
        // TODO: ask andrew tomorrow to look into how to mock a prisma call fully
        // prismaMock.movie.findMany.mockImplementation((prismaPayload: PrismaPayload) => {
        //     const search = prismaPayload.where.title.contains
        //     return fakeMovies.filter(movie => movie.title.includes(search))
        // })

        //make a get req to movies with a search query param
        const searchRes = await supertest(app).get("/movies?search=Fake")

        //todo make this a search function
        expect(searchRes.status).toEqual(200)
        expect(searchRes.body).toEqual([fakeMovie])

    })

    test.skip("Get movie by id", async () => {
        // prismaMock.movie.findUnique.mockResolvedValue(fakeMovie)

        //make a get req to movies by searching id
        const movieById = await supertest(app).get("/movies/345897")

        //todo: insert some actual data to test
        expect(movieById.status).toEqual(200)
        expect(movieById.body).toEqual(fakeMovie)

    })


})

