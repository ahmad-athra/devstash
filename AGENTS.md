<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:Devstash project context -->

# Devstash

A developer knowlodge hub for snippets, prompts, commands, notes, files, images, links, and custom types.

## context files

Read the following to get full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interactions.md
- @context/current-feature.md
<!-- END:Devstash project context -->

<!-- BEGIN:credential-safety-rules -->

# Credential and Configuration Safety

To protect sensitive keys, APIs, and personal data:
- **Never commit `.agents/mcp_config.json`** or any other MCP/local server configuration files containing sensitive credentials to the git repository. Ensure they are listed in `.gitignore`.
- **Never commit `.env` or `.env.production` files**.
- **Avoid exposing API credentials, database URIs, or tokens** (e.g., Neon API keys, Context7 API keys, session secrets) in code commits, prompt instructions, or any tracked config files.

<!-- END:credential-safety-rules -->

