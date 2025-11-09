# DeepSeek API Setup Guide

## Quick Start

### Step 1: Get Your API Key
1. Visit https://platform.deepseek.com
2. Sign up or log in
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key (it starts with `sk-`)

### Step 2: Configure the Key

#### Method 1: .env File (Recommended)
1. Open the `.env` file in the project root
2. Replace the placeholder with your actual key:
   ```
   VITE_DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   ```
3. Save the file
4. Restart the dev server:
   ```bash
   npm run dev
   ```

#### Method 2: Settings UI
1. Start the app
2. Click on "⚙️ Settings" tab
3. Paste your API key in the input field
4. Click "Save API Key"

### Step 3: Start Using AI Features
- **Hand Analyzer**: Click "🤖 AI Analysis" after selecting a hand
- **AI Coach**: Ask any poker strategy question

## Security Notes
- ✅ Your API key is stored locally (browser storage or .env file)
- ✅ The .env file is git-ignored and won't be committed
- ✅ API key is only sent to DeepSeek's servers
- ⚠️ Never share your API key with others
- ⚠️ Don't commit .env file to public repositories

## Troubleshooting

### "Invalid API key" error
- Check that your key starts with `sk-`
- Verify the key is correctly copied (no extra spaces)
- Ensure the key is active on the DeepSeek platform

### API key not working after adding to .env
- Make sure you restarted the dev server
- Check the file is named exactly `.env` (with the dot)
- Verify the variable name is `VITE_DEEPSEEK_API_KEY`

### Switch between .env and Settings UI
- Settings UI key takes priority over .env
- To use .env key, remove the key from Settings UI
- The app will automatically fall back to .env

## Environment Variables

The app uses Vite's environment variable system:
- Variables must start with `VITE_` to be accessible in the browser
- `.env` file is loaded automatically by Vite
- Changes require server restart

## Cost Considerations

DeepSeek API charges per token used:
- Hand analysis: ~500-1000 tokens per request
- Chat messages: ~200-800 tokens per request
- Check current pricing at https://platform.deepseek.com/pricing

Monitor your usage on the DeepSeek platform dashboard.
