import dotenv from 'dotenv';
import { createApp } from './presentation/app';
import { connectToDatabase } from './infrastructure/database/mongodb/connection';
import { MongoPlayerRepository } from './infrastructure/database/repositories/MongoPlayerRepository';
import { MongoTeamRepository } from './infrastructure/database/repositories/MongoTeamRepository';
import { MongoGameRepository } from './infrastructure/database/repositories/MongoGameRepository';
import { MongoGameStatsRepository } from './infrastructure/database/repositories/MongoGameStatsRepository';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/statcoach_pro';

async function startServer() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await connectToDatabase(MONGODB_URI);

    // Initialize repositories
    const playerRepository = new MongoPlayerRepository();
    const teamRepository = new MongoTeamRepository();
    const gameRepository = new MongoGameRepository();
    const gameStatsRepository = new MongoGameStatsRepository();

    // Create Express app with repositories
    const app = createApp({
      playerRepository,
      teamRepository,
      gameRepository,
      gameStatsRepository
    });

    // Start server
    app.listen(PORT, () => {
      console.log('🚀 Server started successfully!');
      console.log(`📍 API running at: http://localhost:${PORT}`);
      console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('\n✨ Ready to accept requests!\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
