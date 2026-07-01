#!/usr/bin/env node

import { program } from "commander";
import { commitCode, initialize } from "../src/commands.js";

program.name("trail").description("A version control system").version("1.0.0");

// command to initialize the trail repository
program
  .command("init")
  .description("Initialize repository")
  .action(() => initialize());

// command to make a commit
program
  .command("commit")
  .description("Commit the current source code")
  .argument('[commitDesc]',"Commit description or message")
  .action((commitDesc) => commitCode(commitDesc));

// parse the arguments passed by user
program.parse();
