# Load Action

1. Check the parameter string provided after "load" in {{args}}:
   - If it looks like a filename (single word, no spaces): Look for `context/features/{name}.md` or a local file matching that name.
   - If it's multiple words: Use it directly as an inline feature description and generate goals.
   - If empty: Return an error - "load" requires a spec filename or feature description.

2. Update .gemini/current-feature.md:
   - Update H1 heading to include feature name (e.g., `# Current Feature: Add Navbar`)
   - Write goals as bullet points under ## Goals
   - Write any additional notes/context under ## Notes
   - Set Status to "Not Started"

3. Confirm spec loaded and show the feature summary to the user.
