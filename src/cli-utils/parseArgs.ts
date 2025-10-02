import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const makeCommand = (p: typeof process) => yargs()
  .scriptName("compile")
  .usage("$0")
  .help()
  .parse(hideBin(p.argv))

export const compileCommand = makeCommand(process)

