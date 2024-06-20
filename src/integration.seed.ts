import client from "./lib/client";

const seed = async () => {
    await client.movie.deleteMany({
        where: {},
    });
    await client.user.deleteMany({
        where: {},
    });

    await client.favorite.deleteMany({
        where: {},
    });

    const user = await client.user.createMany({
        data: [
            {
                id: "0001",
                name: "Sarah"
            },
            {
                id: "0002",
                name: "Dorothy"
            },
        ]
    })


    const movies = await client.movie.createManyAndReturn({
        data: [
            {
                id: "345897",
                title: "Fakery",
                description: "The phoniest movie ever",
            },
            {
                id: "5645645",
                title: "New Movie",
                description: "I'm new",
            },
            {
                id: "3453453",
                title: "The Craziest Movie Ever",
                description: "super super crazy",
            },
        ],
    });

    const favorites = await client.favorite.create({
        data: {
            userId: "0001",
            movieId: "3453453"
        }
    })
};

export default seed;