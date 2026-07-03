# Trail 🌲

A lightweight version control system built from scratch to understand the inner workings of snapshots, content-addressable storage, and project history tracking. 

Trail focuses on the core principles of version control: hashing file contents for integrity, compressing data for efficiency, and managing a clean commit history.

## 🚀 Features

- **Snapshot-Based Architecture:** Rebuilds project states based on file content hashes rather than simple file deltas.
- **Content-Addressable Storage:** Hashes and compresses your files, storing them securely using their cryptographic hash as the identifier.
- **Safe State Restoration:** Reverts your working directory to any previous commit safely without destroying untracked files.
- **History Visualization:** View a concise timeline of your repository's commits directly from the terminal.

---

## 🛠️ How It Works Behind the Scenes

Trail operates on the same structural foundations that power modern version control systems like Git:

1. **Hashing & Compression:** When tracking files, Trail reads the content of each file, generates a unique cryptographic hash, compresses the data, and stores it inside the `.trail` directory using the hash as its filename.
2. **Centralized History:** All commits, metadata, timestamps, and file state pointers are recorded in a structured `history.json` ledger inside your local `.trail` environment.
3. **Smart Reverting:** When you jump to a past commit ID, Trail checks your current working directory. If a file exists locally but wasn't part of the target commit, Trail leaves it untouched to prevent data loss. If a file was present in the target commit but is missing locally, Trail dynamically recreates it.

---

## 📦 Installation

Install Trail globally via npm to use the CLI tool anywhere on your machine:

```bash
npm install -g @umarfarooq57/trail