import supertest from "supertest";
import client from "../lib/client";
import seed from "../integration.seed";
import app from "../app";

beforeEach(async () => {
    await seed();
});

describe("our five movie api routes", () => {
    //check that we return the expected postgres database url
    test("should return the expect postgres database url", () => {
        expect(process.env.DATABASE_URL).toBe(
            "postgresql://postgres:postgres@localhost:10101/postgres"
        );
    });
});

describe("Get movies", () => {
    //make a get request to pull in a list of all the movies in the database
    test("get all movies works", async () => {
        const movies = [
            {
                id: '345897',
                title: 'Fakery',
                description: 'The phoniest movie ever'
            },
            {
                id: '5645645',
                title: 'New Movie',
                description: "I'm new"
            },
            {
                id: '3453453',
                title: 'The Craziest Movie Ever',
                description: 'super super crazy'
            }
        ]
        const movieResults = await supertest(app).get("/movies")


        expect(movieResults.status).toEqual(200)
        expect(movieResults.body).toEqual(movies)

    })
})


describe("Get movies by id", () => {
    //make a get req to pull in a specific movie by searching the id
    test("get a movie by id works", async () => {
        const fakeMovie =
        {
            id: "345897",
            title: "Fakery",
            description: "The phoniest movie ever",
        }

        //make a get req to movies by searching id
        const movieById = await supertest(app).get("/movies/345897")

        //todo: insert some actual data to test
        expect(movieById.status).toEqual(200)
        expect(movieById.body).toEqual(fakeMovie)
    })
})

describe("movie favoriting", () => {
    test("first time the user favorites, return 200 and favorite the movie", async () => {
        const favoritedMovie =
        {
            userId: "0002",
            movieId: "3453453"
        }

        //make a post req to update the movie with userId who favorited the movie
        const favoritedMoviebyUser = await supertest(app)
            .put('/movies/3453453/favorites')
            .set({ "content-type": "application/json" })
            .send({
                userId: "0002"
            })

        expect(favoritedMoviebyUser.status).toEqual(200)
        expect(favoritedMoviebyUser.body).toEqual(favoritedMovie)
    })

    test("second time user favorites, return 200 and delete the movie", async () => {
        //make a post req to update the movie with userId who favorited the movie
        const favoritedMoviebyUser = () => supertest(app)
            .put('/movies/3453453/favorites')
            .set({ "content-type": "application/json" })
            .send({
                userId: "0002"
            })

        await favoritedMoviebyUser()
        const favoriteResponse = await favoritedMoviebyUser()

        expect(favoriteResponse.status).toEqual(200)
        expect(favoriteResponse.body).toEqual("Favorite has been removed")
    })

    test("third time user favorites, return 200 and recreate the favorite", async () => {
        const favoritedMoviebyUser = () => supertest(app)
            .put('/movies/3453453/favorites')
            .set({ "content-type": "application/json" })
            .send({
                userId: "0002"
            })

        await favoritedMoviebyUser()
        await favoritedMoviebyUser()
        const favoriteResponse = await favoritedMoviebyUser()

        const favoritedMovie =
        {
            userId: "0002",
            movieId: "3453453"
        }

        expect(favoriteResponse.status).toEqual(200)
        expect(favoriteResponse.body).toEqual(favoritedMovie)

    })

})

describe("get favorite movies by userId", () => {
    test("get a list of favorite movies by userId", async () => {
        const favoritedMovies = [
            {
                userId: "0001",
                movieId: "3453453"
            },
            {
                userId: "0001",
                movieId: "5645645"
            },
            {
                userId: "0001",
                movieId: "345897"
            }
        ]

        const favMovieById = await supertest(app).get("/0001/favorites")

        expect(favMovieById.status).toEqual(200)
        expect(favMovieById.body).toEqual(favoritedMovies)
    })
})