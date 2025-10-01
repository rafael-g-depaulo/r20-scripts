import { join } from 'path';
import { makeSpellListString } from './businessLogic/spellList';
import { getClassname, makeClassSpellList } from './classSpellList';
import { listFiles, readFile, writeToFile } from './file';
import { writeTagSpellLists } from './tags';
import { compileSingleClassBook, postProccessSingleClassBook } from './compileBook/compileSingleClassBook';
import { CompileRulesDeps, compileRules, processContent } from './compileBook';
import { allSpellsFile, ClassesFolder, CompiledClassesFolder, compiledClassSpellList, CompiledSpelllistsFolder, rootRulesFile, tagSpellListsFile } from './filesConfig';
import { Content } from './parseContent';


export const compileBook = async (
  { allSpells, classSpellListRules }: Content,
  compileDeps: CompileRulesDeps
): Promise<string> => {
  // write all spells
  writeToFile(
    CompiledSpelllistsFolder,
    allSpellsFile,
    makeSpellListString(allSpells, 'All')
  );

  // create tag spell lists
  writeTagSpellLists(CompiledSpelllistsFolder, tagSpellListsFile)(allSpells);

  // compile class spell lists
  const casterSpellRules = classSpellListRules
    .filter(({ rules }) => !!rules)
    .map(({ filename, rules }) => ({
      classname: getClassname(filename),
      rules,
    }));

  // Write spell rules to spell files
  Promise.all(
    casterSpellRules.map(({ classname, rules }) => makeClassSpellList(classname, rules!, compileDeps).then(spellList => writeToFile(
      CompiledSpelllistsFolder,
      compiledClassSpellList(classname),
      spellList
    )
    )
    )
  );

  // compile all classes
  listFiles(ClassesFolder).then(classfiles => Promise.all(
    classfiles.map(classfile => readFile(join(ClassesFolder, classfile))
      .then(processContent(compileDeps))
      .then(compileSingleClassBook(classSpellListRules, allSpells, compileDeps))
      .then(postProccessSingleClassBook)
      .then(classContent => writeToFile(CompiledClassesFolder, classfile, classContent)
      )
    )
  )
  );

  // compile all rules
  return compileRules(rootRulesFile, compileDeps);
};

