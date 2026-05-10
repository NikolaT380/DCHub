# Git Workflow and Best Practices

## Branch Structure

    main          production-ready, protected, merge via PR only
    development   active development, default branch
    feature/*     one branch per feature, branched from development
    bugfix/*      one branch per bug fix, branched from development

## Starting a New Feature or Fix

Always start from an updated development branch:

    git checkout development
    git pull --rebase origin development
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/short-description

Naming examples:

    feature/auth
    feature/file-upload
    feature/csv-preview
    bugfix/fix-auth-token
    bugfix/file-size-limit

## Commit Message Convention

    [FTR]      new feature
    [FIX]      bug fix
    [CHORE]    setup, config, dependencies
    [DOCS]     documentation only
    [REFACTOR] restructuring without behavior change
    [STYLE]    formatting only

Examples:

    [FTR] add JWT token validation
    [FIX] resolve file upload size limit error
    [DOCS] update API endpoint list
    [CHORE] add opencsv dependency

## Daily Work

    git add .
    git commit -m "[FTR] describe what you did"
    git push origin feature/your-feature-name

## Pull Request Guidelines

- Open a PR on GitHub: base = development, compare = feature/your-branch
- Title: use the same commit convention [FTR], [FIX], etc.
- Description: briefly explain what changed and why
- Use checkboxes for sub-tasks if needed:
    - [x] JWT filter implemented
    - [ ] unit tests added
- The other team member must review and approve before merging
- Merge using Squash and Merge to keep history clean
- Delete the feature branch after merging

## Resolving Conflicts

Never merge development into your feature branch. Always rebase:

    git checkout feature/your-branch
    git fetch origin
    git rebase origin/development
    # fix conflicts if any, then:
    git add .
    git rebase --continue
    git push --force-with-lease

## Merging Development into Main

Only when development is fully stable and tested:

1. Open a PR: base = main, compare = development
2. Both team members approve
3. Merge

## Security Rules

- Never commit .env files, API keys, passwords, or certificates
- Always check .gitignore before committing new config files
- If you accidentally commit a secret, notify the team immediately and rotate the key

## Useful Commands

    git status                          check current changes
    git diff                            see line-by-line changes
    git log --oneline --graph --all     view full branch history tree
    git checkout -                      switch to previous branch
    git remote -v                       check remote origins
    git stash                           temporarily save uncommitted changes
    git stash pop                       restore stashed changes
