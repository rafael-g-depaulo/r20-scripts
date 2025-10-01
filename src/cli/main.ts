import { writeToFile } from '../file';
import { getPostProcessInfo, postProcess } from '../postProcessing';
import { cleanResults } from "../cleanResults";
import { parseContent, parseContentDeps } from "../parseContent";
import { compileBook } from "../compileBookString";
import { CompileRulesDeps } from '../compileBook';
import { baseDir, ClassesFolder, ArchetypesFolder, CompiledFolder, rulebookFile } from '../filesConfig';

// read, analyse and compile stuff
export const main = async ({ fileLocations }: parseContentDeps) => {
  await cleanResults({ fileLocations });

  const { allSpells, classSpellListRules, archetypes, classThemes } = await parseContent({ fileLocations });

  const compileDeps: CompileRulesDeps = {
    currentFolder: baseDir,
    classesFolder: ClassesFolder,
    archetypesFolder: ArchetypesFolder,
    allSpells,
    archetypes,
    classThemes,
  };

  const ruleBookRawContent = await compileBook(
    { allSpells, classSpellListRules, archetypes, classThemes },
    compileDeps
  );
  const postProcessedBook = postProcess(
    ruleBookRawContent,
    getPostProcessInfo(ruleBookRawContent)
  );

  await writeToFile(CompiledFolder, rulebookFile, postProcessedBook);
};

