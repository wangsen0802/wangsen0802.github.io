# MCP Configuration

This directory contains Model Context Protocol (MCP) server configurations for
Claude Code.

## Currently Configured Servers

### ✅ Filesystem Server

- **Purpose**: Provides file system access within the project
- **Scope**: Project directory only
  (`/Users/wangsen/person_project/wangsen0802.github.io`)
- **Status**: ✅ Connected and working
- **Usage**: Enhanced file operations, directory browsing

## How to Add More MCP Servers

You can add additional MCP servers using the `claude mcp add` command:

### Examples:

```bash
# Add Git server
claude mcp add --transport stdio git -- npx -y @modelcontextprotocol/server-git /Users/wangsen/person_project/wangsen0802.github.io

# Add Brave Search (requires API key)
claude mcp add --transport stdio brave-search --env BRAVE_API_KEY=your_key -- npx -y @modelcontextprotocol/server-brave-search

# Add GitHub (requires personal access token)
claude mcp add --transport stdio github --env GITHUB_PERSONAL_ACCESS_TOKEN=your_token -- npx -y @modelcontextprotocol/server-github

# Add SQLite database
claude mcp add --transport stdio sqlite -- npx -y @modelcontextprotocol/server-sqlite --db-path data/database.db

# Add PostgreSQL database (requires connection string)
claude mcp add --transport stdio postgres --env POSTGRES_CONNECTION_STRING="postgresql://user:password@localhost:5432/dbname" -- npx -y @modelcontextprotocol/server-postgres
```

## Management Commands

```bash
# List all configured MCP servers
claude mcp list

# Get details about a specific server
claude mcp get filesystem

# Remove an MCP server
claude mcp remove server_name

# Get help with MCP commands
claude mcp --help
```

## Popular MCP Servers

1. **Filesystem** - File and directory operations ✅ _Already configured_
2. **Git** - Git repository operations
3. **Brave Search** - Web search capabilities
4. **GitHub** - GitHub API integration
5. **SQLite** - SQLite database access
6. **PostgreSQL** - PostgreSQL database access
7. **Slack** - Slack workspace integration
8. **Google Drive** - Google Drive file access

## API Key Setup

For servers that require API keys, you have several options:

### Option 1: Environment Variables (Recommended)

```bash
export BRAVE_API_KEY="your_brave_api_key"
export GITHUB_PERSONAL_ACCESS_TOKEN="your_github_token"
```

### Option 2: Add with Environment Variables

```bash
claude mcp add --transport stdio brave-search --env BRAVE_API_KEY="your_key" -- npx -y @modelcontextprotocol/server-brave-search
```

### Option 3: Add to ~/.claude/settings.json

```json
{
  "env": {
    "BRAVE_API_KEY": "your_brave_api_key",
    "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token"
  }
}
```

## Usage

Once MCP servers are configured, you can use them through natural language:

- "Read all files in the src directory"
- "Search for TypeScript files that contain Vue components"
- "Show me the recent git commits"
- "Search the web for Vue 3 best practices"

## Security

- Filesystem access is restricted to the configured project directory
- API keys should be kept secure and not committed to version control
- MCP servers run in isolated environments
- Only add MCP servers from trusted sources
