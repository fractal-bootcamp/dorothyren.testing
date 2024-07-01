import supertest from "supertest";
import app from "../app";
import { prismaMock } from "./testclient";


const fakemovies =
    [{
        id: "1234567",
        title: "fake title",
        description: "fake description"
    }]


prismaMock.movie.findMany.mockResolvedValue(fakemovies)

describe("Our five movie API routes", () => {
    test("get movies", async () => {
        //make a get request to movies
        const moviesresult = await supertest(app).get("/movies");
        // to do:insert some actual data to test
        expect(moviesresult.status).toEqual(200);
        expect(moviesresult.body).toEqual(fakemovies);
        //make a get request to movies with a search query param
        const searchresults = await supertest(app).get("/movies?search=inc")
        //to do: insert actual data
        expect(searchresults.status).toEqual(200);
        expect(searchresults.body).toEqual(fakemovies)

    })
})