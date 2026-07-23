# Trail

A VCS (Version Control System) built on the same core principles as Git.

---

## Core Features included:
- Initialize a trail repository. Run `trail init`
- Commit the project with a message. Run `trail commit 'commit_description'`
- View Commit history. Run `trail log --oneline`
- Revert back to any commit in history. Run `trail revert 'commit_id'`
- Compresses the file contents before storing them
- It hashes the content of each file and sets that hash as the title of that file after it is compressed.

---

## How it works? Step-by-step workflow
1. You run `trail init`, it initializes an empty trail repository.
2. When you have completed a specific feature of your project, run `trail commit 'commit_desc'` to save a snapshot of current state of your project in history.
3. View commit history by `trail log --oneline`.
4. If you want to go back to a specific commit in history, just run `trail revert 'commit_id"`. (Get commit id by running 'trail log --oneline')

---

## Where history is stored?
All the history of your project is stored in a `.trail` folder. The structure of `.trail` is:

```
my-project/
│
├── .trail/
│   ├── compressed/
│   └── history.json
│
├── file1.js
├── package.json
└── ...
```

`history.json` stores metadata for every commit.

Each commit contains:

- Commit ID
- Commit message
- Date
- Mapping of project filenames to compressed file hashes

```json
{
  "commitId": "...",
  "commitDesc": "Added authentication",
  "date": "...",
  "files": {
    "index.js": "af82bd73...",
    "app.js": "b17de09a..."
  }
}
```