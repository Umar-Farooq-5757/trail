# Trail

A lightweight Version Control System (VCS) built with Node.js.

Trail is a simple command-line version control system inspired by Git. It allows you to initialize a repository, create snapshots (commits) of your project, browse commit history, and restore your project to any previous commit.

Unlike Git, Trail is designed for learning purposes and demonstrates how a version control system works internally by storing compressed snapshots of files.

---

## Features

- 📦 Initialize a repository
- 💾 Commit your project with a message
- 📝 View commit history
- ⏪ Restore your project to any previous commit
- 🗜️ Compresses file contents before storing them
- 🔐 Uses content hashing to avoid storing duplicate file contents
- 🖥️ Cross-platform CLI (Windows, Linux, macOS)

---

## Installation

### Install Globally

```bash
npm install -g @umarfarooq57/trail
```

Once installed globally, the `trail` command becomes available from anywhere.

Verify the installation:

```bash
trail --version
```

---

## Getting Started

### 1. Navigate to your project

```bash
cd my-project
```

---

### 2. Initialize Trail

```bash
trail init
```

This creates a hidden `.trail` directory inside your project.

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

The `.trail` folder stores all commit history and compressed file snapshots.

---

### 3. Create your first commit

```bash
trail commit "Initial project setup"
```

Example:

```bash
trail commit "Implemented authentication"
```

Every commit stores:

- A unique commit ID
- Commit message
- Timestamp
- Mapping of project files
- References to compressed file contents

---

### 4. View commit history

Show the complete commit history:

```bash
trail log
```

Example output:

```
Commit ID:
3c43a3d8-ef1d-4b77-9fb5-d9d9db29d7cf

Commit Description:
Initial project setup

Date:
Mon Jun 30 2026 18:40:10
```

---

### View one-line history

```bash
trail log --oneline
```

Example:

```
3c43a3d8-ef1d-4b77-9fb5-d9d9db29d7cf Initial project setup

17fd1a2c-2d72-4d3e-b6f4-ec31df4f7fd1 Added login page

f03be61f-5b74-49b8-a996-f53790efc530 Fixed navbar
```

---

### 5. Restore a previous commit

Copy the desired commit ID from the log output.

Then run:

```bash
trail revert <commit-id>
```

Example:

```bash
trail revert 17fd1a2c-2d72-4d3e-b6f4-ec31df4f7fd1
```

Trail restores all tracked files to the state they were in when that commit was created.

---

# Commands

| Command | Description |
|---------|-------------|
| `trail init` | Initialize a Trail repository |
| `trail commit "<message>"` | Create a new commit |
| `trail log` | Display complete commit history |
| `trail log --oneline` | Display compact commit history |
| `trail revert <commit-id>` | Restore project to a previous commit |

---

# How Trail Works

Trail creates a hidden `.trail` directory inside your project.

```
.trail/
├── compressed/
│
└── history.json
```

## Compressed Directory

Whenever you create a commit, Trail:

1. Reads every file in your project.
2. Compresses the file contents.
3. Hashes the original content.
4. Stores the compressed file using its hash as the filename.

Since files are identified by their content hash, identical files are stored only once, even if they appear in multiple commits.

---

## History File

`history.json` stores metadata for every commit.

Each commit contains:

- Commit ID
- Commit message
- Date
- Mapping of project filenames to compressed file hashes

A simplified example:

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

---

# Example Workflow

Initialize:

```bash
trail init
```

Create first commit:

```bash
trail commit "Initial project"
```

Modify your project.

Create another commit:

```bash
trail commit "Added login functionality"
```

View history:

```bash
trail log
```

Restore an earlier version:

```bash
trail revert 3c43a3d8-ef1d-4b77-9fb5-d9d9db29d7cf
```

---

# Project Structure

```
project/
│
├── .trail/
│   ├── compressed/
│   └── history.json
│
├── file1.js
├── package.json
└── ...
```

---

# Notes

- `.trail` should not be modified manually.
- `node_modules` is ignored automatically.
- Duplicate file contents are stored only once.
- Commits are identified using UUIDs.
- File contents are compressed before being written to disk.

---

# Current Limitations

This project is intentionally lightweight and educational.

Current limitations include:

- Tracks only files in the project root directory.
- Does not support nested folders recursively.
- Does not provide branching or merging.
- No staging area.
- No diff viewer.
- No conflict resolution.

---

# Future Improvements

Some possible future enhancements:

- Recursive directory traversal
- Ignore files using a `.trailignore`
- Branch support
- Merge functionality
- File diff viewer
- Tags
- Better rollback handling
- Remote repositories
- Incremental snapshots
- Colored CLI output
- Interactive revert confirmation

---

# Why Trail?

Trail was built as an educational project to understand the internal concepts behind version control systems such as Git, including:

- Snapshot storage
- Content hashing
- File compression
- Commit history
- Repository metadata
- Restoring historical versions

---
# Support
If you find this project useful, consider giving it a ⭐ on GitHub.