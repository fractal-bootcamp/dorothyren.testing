import { PrismaClient } from "@prisma/client";

// create the client
const prisma = new PrismaClient();

async function seed() {
    await prisma.$connect();

    // Users
    const users = [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' }
    ];

    const userRows = await Promise.all(
        // map over each user
        users.map(user => {
            // create the tag in the database and return the result
            return prisma.user.create({
                data: {
                    name: user.name
                }
            })
        }))


    const movies = [
        { title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology.' },
        { title: 'The Matrix', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.' },
        { title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.' }
    ]

    const movieRows = await Promise.all(movies.map(movie => {
        return prisma.movie.create({
            data: {
                title: movie.title,
                description: movie.description,
            }
        })
    }))

    const tags = [
        { tagText: 'Sci-Fi' },
        { tagText: 'Adventure' },
        { tagText: 'Drama' }
    ]

    const tagRows = await Promise.all(
        // map over each tag
        tags.map(tag => {
            // create the tag in the database and return the result
            return prisma.tag.create({
                data: {
                    tagText: tag.tagText
                }
            })
        }))

    // MovieTags (linking movies with tags)
    const movieTags = await prisma.movieTag.createMany({
        data: [
            { movieId: movieRows[0].id, tagId: tagRows[0].id }, // Assuming the IDs are known; adjust according to actual IDs
            { movieId: movieRows[1].id, tagId: tagRows[1].id },
            { movieId: movieRows[2].id, tagId: tagRows[2].id }
        ],
        skipDuplicates: true,
    });



    // Favorites (linking users with movies)
    const favorites = await prisma.favorite.createMany({
        data: [
            { userId: userRows[0].id, movieId: movieRows[0].id }, // Assuming the IDs are known; adjust according to actual IDs
            { userId: userRows[1].id, movieId: movieRows[1].id },
            { userId: userRows[2].id, movieId: movieRows[2].id }],
        skipDuplicates: true,
    });

    await prisma.$disconnect();
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});