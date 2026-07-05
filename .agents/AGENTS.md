# Workspace Agent Rules

<!-- BEGIN:credential-safety-rules -->

# Credential and Configuration Safety

To protect sensitive keys, APIs, and personal data:
- **Never commit `.agents/mcp_config.json`** or any other MCP/local server configuration files containing sensitive credentials to the git repository. Ensure they are listed in `.gitignore`.
- **Never commit `.env` or `.env.production` files**.
- **Avoid exposing API credentials, database URIs, or tokens** (e.g., Neon API keys, Context7 API keys, session secrets) in code commits, prompt instructions, or any tracked config files.

<!-- END:credential-safety-rules -->
