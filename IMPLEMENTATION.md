# Good First Issue Finder Implementation

## Overview
This chatbot has been transformed from a flight booking assistant to a GitHub repository and good first issue finder specialized in decentralized applications (DApps).

## Features

### 1. Search for Repositories
The chatbot can search GitHub for repositories related to decentralized applications with good first issues.

**Example queries:**
- "Find me good first issues in decentralized app repositories"
- "Show me beginner-friendly Web3 projects"
- "What are good blockchain repositories for 2nd year engineering students?"

### 2. Find Good First Issues
Once a repository is identified, the chatbot can find specific issues labeled as "good-first-issue".

**Example query:**
- "Find good first issues in ethereum/web3.js"

### 3. Get Repository Details
The chatbot can provide detailed information about a specific repository including stars, forks, topics, and more.

**Example query:**
- "Tell me more about ethereum/web3.js"

## Technical Implementation

### API Tools
Three main tools interact with the GitHub API:

1. **searchRepositories**
   - Searches for repositories with decentralized app topics
   - Filters by good-first-issue labels
   - Returns top repositories sorted by stars

2. **findGoodFirstIssues**
   - Searches for open issues with good-first-issue label
   - Returns recent issues sorted by creation date
   - Includes issue metadata (comments, labels, etc.)

3. **getRepositoryDetails**
   - Fetches comprehensive repository information
   - Includes stats, topics, and configuration

### UI Components
Three React components display the results:

1. **ListRepositories** (`components/github/list-repositories.tsx`)
   - Displays repository search results
   - Shows stars, language, topics, and descriptions
   - Clickable to explore issues

2. **ListIssues** (`components/github/list-issues.tsx`)
   - Shows good first issues from a repository
   - Displays labels, timestamps, and comment counts
   - Links directly to GitHub issues

3. **RepositoryDetails** (`components/github/repository-details.tsx`)
   - Presents detailed repository information
   - Shows stats (stars, forks, issues)
   - Displays topics and license information

## Target Technologies
The chatbot specializes in finding issues related to:
- Blockchain
- Web3
- Ethereum
- Solidity
- DeFi (Decentralized Finance)
- NFTs
- DAOs (Decentralized Autonomous Organizations)
- IPFS
- Smart Contracts

## For Developers

### Running Locally
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your GOOGLE_GENERATIVE_AI_API_KEY and AUTH_SECRET

# Run development server
pnpm dev
```

### Testing
Ask the chatbot questions like:
- "Find me good first issues in decentralized app repositories for a beginner"
- "Search for Web3 projects with good documentation"
- "Show me Ethereum repositories suitable for 2nd year engineering students"

The chatbot will use the GitHub API to search for relevant repositories and issues.

## Note
This implementation requires:
- Google Gemini API key for the AI model
- Internet access to query GitHub's public API
- NextAuth configuration for user authentication
