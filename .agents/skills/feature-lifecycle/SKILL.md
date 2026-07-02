---
name: feature
description: Manage current feature workflow - start, review, explain, test or complete
argument-hint: load|start|review|explain|complete
user-invocable: true
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

@context/current-feature.md

### File Structure

current-feature.md has these sections:

- `# Current Feature` - H1 heading with feature name when active
- `## Status` - Not Started | In Progress | Complete
- `## Goals` - Bullet points of what success looks like
- `## Notes` - Additional context, constraints, or details from spec
- `## History` - Completed features (append only)

## Task

Execute the requested action parsed from the user's string: {{args}}

| Action     | Description                               | Detailed Blueprint      |
| ---------- | ----------------------------------------- | ----------------------- |
| `load`     | Load a feature spec or inline description | See actions/load.md     |
| `start`    | Begin implementation, create branch       | See actions/start.md    |
| `review`   | Check goals met, code quality             | See actions/review.md   |
| `explain`  | Document what changed and why             | See actions/explain.md  |
| `complete` | Commit, push, merge, reset                | See actions/complete.md |

If no action is provided in {{args}}, explain the available options.
