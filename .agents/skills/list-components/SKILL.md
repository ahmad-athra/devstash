---
name: list-components
description: List project components in a subdirectory
---

# Task

List all React component files (.tsx, .ts, .jsx, .js) in the components folder.

If a subdirectory is provided via arguments or context, only list files in that specific subdirectory.

# Output Format

- Numbered list of files with relative paths
- Brief one-line description of each (infer from filename)
- Summary count at the end

If no files are found, say "No components found."
