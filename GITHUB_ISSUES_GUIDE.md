# GitHub Issues Guide for AI Agents

## Purpose
This guide establishes the mandatory workflow for all AI development agents working on this project. To ensure high-quality project management, traceability, and milestone tracking, every task, feature, bug fix, or refactor must be properly documented and tracked using GitHub Issues.

## Core Rules

### 1. Check Existing Issues Before Starting
- At the beginning of any session or before starting a new task, query the existing GitHub issues to ensure you are not duplicating work.
- If an issue exists for the task, review its context, add it to the current milestone (if applicable), and add a comment stating that work has started.

### 2. Create New Issues for Unplanned Work
- If a requested task does not have an associated issue, **create one immediately** before writing any code.
- Use clear, descriptive titles.
- Include a brief description of the objective, acceptance criteria, and necessary context.

### 3. Status Updates & Comments
- As you progress through a task, add comments to the issue summarizing significant milestones, design decisions, or blockers.
- If a conversation or session is ending, leave a summary comment on the issue detailing what was accomplished and what remains to be done.

### 4. Execution (Branching & Commits)
- **Branching**: A specific branch must be created for each issue.
  - **Naming Convention**: `feat/issue-ID-short-description` or `fix/issue-ID-short-description`.
- **Commits**: All commit messages must reference the issue ID in brackets.
  - **Format**: `[#ISSUE_ID] Commit message` (e.g., `[#12] Add responsive styles to header`).
  - If a commit is directly related to a fix or feature, ensure the format is strictly followed.

### 5. Closing Issues
- Only close an issue when all acceptance criteria have been met and the code has been successfully merged, pushed, or verified.
- Provide a final summary comment explaining the resolution when closing the issue.

## Issue Labels
Apply the following labels when creating or updating issues:
- **`enhancement`**: New features or improvements.
- **`bug`**: Errors or broken functionality.
- **`documentation`**: Changes to README, guides, or code comments.
- **`refactor`**: Code cleanup without logic change.
- **`urgent`**: Blocks critical workflows.

## Issue Format Template
When creating a new issue, populate the following structure:

```markdown
### Description
[Clear, concise description of the feature, bug, or task]

### Acceptance Criteria
- [ ] Step or condition 1 required to consider this complete
- [ ] Step or condition 2 required to consider this complete

### Context (Optional)
[Relevant files, previous issues, or links to references]
```

## Agent Session Checklist
Whenever you are activated for a new task, verify the following:
- [ ] Have I checked for existing issues related to the user's prompt?
- [ ] Have I created an issue if one doesn't exist?
- [ ] Am I referencing the issue ID in my proposed file updates and commits?
- [ ] Have I updated the issue with my progress?
- [ ] Is the milestone mapping up to date?

*Failure to follow this guide will result in misaligned milestones and loss of project tracking.*
