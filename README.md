# Codenames AI Simulation

An interactive web application that simulates AI models playing the classic board game [Codenames](<https://en.wikipedia.org/wiki/Codenames_(board_game)>). Watch different AI models compete against each other as Spymasters and Operatives, with real-time game visualization, analytics, and a global leaderboard.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎮 Features

### Game Simulation

- **AI vs AI Gameplay**: Watch different AI models compete in Codenames
- **Real-time Updates**: Live game board with card reveals and team progress
- **Multiple AI Models**: Support for GPT-4o, Claude Sonnet, Gemini Pro, Llama 3, Mistral, and Grok
- **Smart AI Logic**: AI models act as both Spymasters (giving clues) and Operatives (making guesses)

### Analytics & Tracking

- **Live Game Log**: Real-time turn-by-turn gameplay history with clues and guesses
- **Statistics Panel**: Track win rates, game durations, and performance metrics
- **Global Leaderboard**: Persistent cross-session leaderboard showing model win rates
- **Game History**: Browse past games with detailed results and statistics
- **Match Recording**: All games are saved to local storage for future reference

### User Experience

- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Batch Simulations**: Run multiple games automatically to collect statistics
- **Speed Control**: Adjust simulation speed for optimal viewing
- **Team Selection**: Choose different AI models for each team
- **Visual Feedback**: Animated card reveals, progress indicators, and status updates

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- An API key from a supported AI provider (configured via environment variable or the Vercel AI SDK)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/codenames-ai-simulation.git
   cd codenames-ai-simulation
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # Add your AI provider API keys
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
   # ... other provider keys as needed
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### Game Flow

1. **Initialization**: A 5x5 grid of word cards is generated with random assignments:

   - 9 cards for the starting team (Red)
   - 8 cards for the other team (Blue)
   - 7 neutral cards
   - 1 assassin card (instant loss if revealed)

2. **Spymaster Phase**: The AI acting as Spymaster sees all card identities and provides:

   - A one-word clue
   - A number indicating how many words relate to that clue

3. **Operative Phase**: The AI Operative makes guesses based on the clue:

   - Continues guessing until wrong or all clues used
   - Game ends when a team reveals all their words or hits the assassin

4. **Result Tracking**: Game results are saved locally and to the global leaderboard

### AI Model Integration

The app uses the [Vercel AI SDK](https://sdk.vercel.ai/) to support multiple AI providers:

- **OpenAI**: GPT-4o
- **Anthropic**: Claude 3.5 Sonnet
- **Google**: Gemini 1.5 Pro
- **Meta**: Llama 3.1 70B
- **Mistral**: Mistral Large
- **xAI**: Grok Beta

Each model uses carefully crafted prompts to understand the game rules and make strategic decisions.

## 📁 Project Structure

```
codenames-ai-simulation/
├── app/                    # Next.js app directory
│   ├── api/               # API routes for stats and storage
│   └── page.tsx           # Main entry point
├── components/            # React components
│   ├── game-view.tsx      # Main game container
│   ├── game-board.tsx     # 5x5 card grid
│   ├── game-card.tsx      # Individual card component
│   ├── game-controls.tsx  # Play/pause, model selection
│   ├── game-status.tsx    # Current game state display
│   ├── game-log.tsx       # Turn-by-turn history
│   ├── stats-panel.tsx    # Win rate statistics
│   ├── leaderboard.tsx    # Global model rankings
│   ├── game-history.tsx   # Past games browser
│   └── ui/                # Reusable UI components (Radix UI)
├── lib/                   # Core logic
│   ├── ai-service.ts      # AI model integration
│   ├── game-engine.ts     # Game rules and state management
│   ├── types.ts           # TypeScript type definitions
│   ├── storage.ts         # Local and persistent storage
│   ├── word-bank.ts       # Codenames word list
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
│   └── use-game-simulation.ts  # Game state and automation
├── data/                  # Persistent data
│   └── matches.json       # Global match history
├── styles/                # Global styles
└── public/                # Static assets
```

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://reactjs.org/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with Zod validation
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Animations**: [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)

## 📊 Data Persistence

### Local Storage

- Current game state
- Session statistics
- User preferences

### File System (`data/matches.json`)

- Global match results
- Cross-session leaderboard data
- Historical game records

## 🎨 Customization

### Adding New AI Models

Edit `lib/ai-service.ts`:

```typescript
export const AI_MODELS: Record<string, AIModelConfig> = {
  // ... existing models
  "your-model": {
    name: "Your Model Name",
    modelId: "provider/model-id",
  },
};
```

### Adjusting Game Rules

Modify `lib/game-engine.ts` to change:

- Board size (default: 5x5)
- Card distributions (red/blue/neutral/assassin counts)
- Turn logic
- Win conditions

### Customizing Word Bank

Update `lib/word-bank.ts` to use your own word list.

## 🚢 Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/codenames-ai-simulation)

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- Any other provider API keys you're using

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured for Next.js and React best practices
- **Prettier**: Code formatting (if configured)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Codenames** is a board game designed by Vlaada Chvátil and published by Czech Games Edition
- UI components built with [Radix UI](https://www.radix-ui.com/)
- AI capabilities powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- Word list adapted from the original Codenames game

## 📧 Contact

Ryan - [GitHub Profile](https://github.com/yourusername)

Project Link: [https://github.com/yourusername/codenames-ai-simulation](https://github.com/yourusername/codenames-ai-simulation)

---

**Note**: This is a fan-made simulation for educational and entertainment purposes. Codenames is a trademark of Czech Games Edition.
