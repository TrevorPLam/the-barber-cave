# Next.js DevTools MCP Integration

## Overview

This project has been configured with Next.js DevTools MCP (Model Context Protocol) integration to enable AI-assisted debugging and development workflows.

## Installation

The MCP server was installed using the official `add-mcp` CLI tool:

```bash
npx add-mcp next-devtools-mcp@latest
```

## Configuration

The MCP server is automatically configured for all supported AI agents:

### Configuration Files Created
- `.mcp.json` - Claude Code configuration
- `.codex/config.toml` - Codex configuration  
- `.cursor/mcp.json` - Cursor configuration
- `.gemini/settings.json` - Gemini CLI configuration
- `.vscode/mcp.json` - VS Code & GitHub Copilot CLI configuration
- `config/mcporter.json` - MCPorter configuration
- `opencode.json` - OpenCode configuration
- `.zed/settings.json` - Zed configuration

### MCP Server Configuration
```json
{
  "mcpServers": {
    "next-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "next-devtools-mcp@latest"
      ]
    }
  }
}
```

## Capabilities

The Next.js DevTools MCP server provides:

### 1. Runtime Diagnostics & Live State Access
- Real-time application state inspection
- Component tree analysis
- Performance metrics
- Error tracking

### 2. Development Automation
- Automated error detection
- Code quality checks
- Build optimization suggestions

### 3. Knowledge Base & Documentation
- Next.js documentation access
- Best practices guidance
- API reference integration

## Usage

### With AI Assistants

Once configured, AI assistants can automatically:
- Detect and diagnose runtime errors
- Access application state for debugging
- Provide contextual code suggestions
- Analyze performance bottlenecks

### Manual Testing

To verify MCP integration:

1. Start the Next.js development server:
   ```bash
   npm run dev
   ```

2. The MCP server will automatically connect when AI assistants are active

3. AI assistants can now access Next.js DevTools capabilities through MCP

## Requirements

- Node.js v20.19+ ✅ (satisfied)
- Next.js 16+ ✅ (satisfied)
- Compatible AI assistant (Claude Code, Cursor, etc.)

## Troubleshooting

### Common Issues

1. **MCP server not connecting**
   - Ensure Next.js dev server is running
   - Check AI assistant MCP configuration
   - Verify Node.js version compatibility

2. **Permission errors**
   - Run with appropriate permissions
   - Check firewall settings for local connections

3. **Module not found errors**
   - Ensure `next-devtools-mcp@latest` is accessible
   - Check internet connection for package resolution

### Verification Commands

```bash
# Check Next.js version
npx next --version

# Verify MCP configuration
cat .mcp.json

# Test MCP server availability
npx -y next-devtools-mcp@latest --version
```

## Benefits

- **Enhanced Debugging**: AI assistants can access real-time application state
- **Automated Error Detection**: Proactive identification of issues
- **Improved Development Workflow**: Seamless integration between AI and development tools
- **Context-Aware Assistance**: AI has full understanding of application internals

## Security & Privacy

The MCP server operates locally and only accesses:
- Development server endpoints
- Application state data
- Build artifacts

No data is sent to external services beyond standard npm package resolution.

## Updates

The MCP server uses `@latest` tag to ensure access to the newest features and security updates. Regular updates are handled automatically through npm.

---

*Last Updated: 2026-03-02*
*Next.js Version: 16.1.6*
*MCP Server: next-devtools-mcp@latest*
