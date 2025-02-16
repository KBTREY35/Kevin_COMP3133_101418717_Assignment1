require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const connectDB = require('./config/db');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            try {
                const user = authMiddleware(req);
                return { user };
            } catch (err) {
                return {};
            }
        },
    });

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
}

startServer();