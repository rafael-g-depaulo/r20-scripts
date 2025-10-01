import { Archetype, parseArchetype } from './businessLogic/archetype';
import { parseThemes, Themes } from './businessLogic/classThemes';
import { dealWithErrors } from './error';
import { listFiles, readFile } from './file';
import { searchMacro, searchMacros } from './macros/parseMacro';
import { readSpells } from './spell';
import { parseTagRules } from './tagRules';
import { parseTagGroups } from './tags';
import { validateSpells } from './validateSpell';
import { Spell } from './businessLogic/spell';
import { GlobalTagRules } from './compileBook/compileSingleClassBook';
// import { tagGroupsFile } from './cli/main';

export interface Content {
  allSpells: Spell[]
  archetypes: Archetype[]
  classThemes: Themes
  classSpellListRules: GlobalTagRules
}

type FileLocations = Record<'tagGroupsFile' | 'CompiledSpelllistsFolder' | 'CompiledClassesFolder' | 'SpellsFolder' | 'SpellDescriptionsFolder' | 'CompiledFolder' | 'errorsFile' | 'themesFile' | 'ClassesFolder' | 'ArchetypesFolder', string>;

export type parseContentDeps = {
  fileLocations: FileLocations;
};
export const parseContent = async ({ fileLocations }: parseContentDeps) => {
  const {
    ArchetypesFolder, ClassesFolder, errorsFile, CompiledFolder, SpellDescriptionsFolder,
    tagGroupsFile,
    SpellsFolder,
    themesFile,

  } = fileLocations;
  const tagGroups = await readFile(SpellsFolder, tagGroupsFile).then(
    parseTagGroups
  );

  // parse all spells
  const allSpells = await readSpells(SpellDescriptionsFolder)
    .then(validateSpells({ tagGroups }))
    .then(dealWithErrors(CompiledFolder, errorsFile));
  // .then(ignoreErrors) // if not using "dealWithErrors" uncomment this line
  // create spell lists for classes
  const classFilenames = await listFiles(ClassesFolder);
  const classSpellListRules = await Promise.all(
    classFilenames.map(filename => readFile(ClassesFolder, filename)
      .then(parseTagRules)
      .then(rules => ({ filename, rules }))
    )
  );

  // read and parse archetypes
  const archetypes = await listFiles(ArchetypesFolder)
    .then(archetypeFilenames => Promise.all(
      archetypeFilenames.map(archetypeFilename => readFile(ArchetypesFolder, archetypeFilename)
      )
    )
    )
    .then(archetypesContents => archetypesContents.join('\n'))
    .then(archetypesContent => searchMacros(archetypesContent, 'define-archetype')
    )
    .then(archetypeMacros => archetypeMacros.map(parseArchetype));

  // read class themes skills
  const classThemes = await readFile(ClassesFolder, themesFile)
    .then(content => searchMacro(content, 'define-themes'))
    .then(parseThemes);

  return {
    archetypes,
    allSpells,
    classSpellListRules,
    classThemes,
  } as Content;
};

