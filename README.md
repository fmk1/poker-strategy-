# Poker Tournament Analyzer

A comprehensive web application for poker tournament players to analyze hands, calculate ICM, and get AI-powered strategic advice.

## Features

### 🃏 Hand Analyzer
- Select your position (UTG, MP, CO, BTN, SB, BB)
- Input your hole cards via interactive card selector
- Specify stack size, tournament stage, and action before you
- Get instant optimal play recommendations (Fold/Call/Raise)
- **NEW: AI-powered analysis with DeepSeek** - Get expert AI insights on your hands
- Detailed reasoning and strategy tips

### 🤖 AI Poker Coach
- Ask any poker strategy question
- Get personalized advice based on your situation
- Interactive chat interface
- Quick question templates for common scenarios
- Powered by DeepSeek AI

### 📊 Push/Fold Calculator
- Nash equilibrium-based push/fold decisions
- Short stack strategy (< 20 BB)
- Position-adjusted recommendations
- Visual stack health indicators

### 💰 ICM Calculator
- Independent Chip Model calculations
- Multi-player support
- Custom prize pool structure
- Real-time equity calculations
- Dollar-per-chip value analysis

### 📈 Tournament Tracker
- M-ratio calculation
- Effective stack in big blinds
- Bubble factor analysis
- Color-coded stack zones (Green/Yellow/Orange/Red/Dead)
- Position tracking relative to money bubble
- Strategy adjustments based on tournament stage

### ⚙️ Settings
- Configure DeepSeek API key
- Secure local storage
- Easy API key management

## Getting Started

### Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Configure DeepSeek API (Optional)

You have two options to configure your DeepSeek API key:

**Option 1: Using .env file (Recommended for development)**
1. Get your API key from [DeepSeek Platform](https://platform.deepseek.com)
2. Open the `.env` file in the project root
3. Replace `your_api_key_here` with your actual API key:
   \`\`\`
   VITE_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   \`\`\`
4. Restart the dev server if it's running

**Option 2: Using the Settings UI**
1. Get your API key from [DeepSeek Platform](https://platform.deepseek.com)
2. Run the app and go to Settings tab
3. Enter your API key
4. It will be saved in your browser's local storage

**Note:** The .env file is git-ignored, so your API key won't be committed to version control.

### Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
npm run build
\`\`\`

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **DeepSeek AI** - AI-powered poker analysis
- **CSS** - Custom styling

## How to Use

1. **Hand Analyzer**: Select your position, stack size, tournament stage, and cards to get play recommendations
   - Click "🤖 AI Analysis" for expert AI insights (requires API key)
2. **AI Coach**: Ask any poker question and get instant strategic advice
3. **Push/Fold**: Input your stack and position to see if you should push or fold with different hand strengths
4. **ICM Calculator**: Enter player stacks and prize structure to calculate tournament equity
5. **Tournament Tracker**: Monitor your stack health and get strategy adjustments based on M-ratio and bubble pressure
6. **Settings**: Configure your DeepSeek API key for AI features

## AI Features

The app integrates with DeepSeek AI to provide:
- Expert hand analysis
- Strategic recommendations
- ICM considerations
- GTO-based advice
- Personalized coaching

**Privacy**: Your API key is stored locally in your browser and only sent to DeepSeek's API. It's never shared with any other service.

## Strategy Concepts

### M-Ratio Zones
- **Green (M > 20)**: Play full poker with all options available
- **Yellow (M 10-20)**: Tighten up, avoid marginal spots
- **Orange (M 6-10)**: Push/fold territory emerging
- **Red (M 3-6)**: Pure push/fold strategy
- **Dead (M < 3)**: Emergency mode - push any reasonable hand

### ICM Implications
- Chips ≠ Money in tournaments
- Short stacks: each chip worth more (survival value)
- Big stacks: diminishing chip value
- Bubble pressure: avoid marginal spots when others can bust

## License

MIT
