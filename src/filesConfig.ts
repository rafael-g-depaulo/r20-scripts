import { join } from 'path';
import { parseContentDeps } from './parseContent';

// config
// const baseDir = join(__dirname, '../../')

export const baseDir = `/home/ragan/Documents/obsidian-vault/RPG/R20`;
export const ArchetypesFolder = join(baseDir, 'Archetypes');
export const ClassesFolder = join(baseDir, 'Classes');
const SpellsFolder = join(baseDir, 'Spells');
const SpellDescriptionsFolder = join(SpellsFolder, 'Spell Descriptions');
export const CompiledFolder = join(baseDir, 'Compiled');
export const CompiledSpelllistsFolder = join(CompiledFolder, 'Spells');
export const CompiledClassesFolder = join(CompiledFolder, 'Classes');
const errorsFile = 'Errors.md';
export const tagGroupsFile = 'Spell Tags.md';
export const tagSpellListsFile = 'Spell List by Tag.md';
export const compiledClassSpellList = (classname: string) => `Class - ${classname} Spell List.md`;
export const rootRulesFile = 'index.md';
export const allSpellsFile = 'All Spells List.md';
// const summaryFile = 'Summary.md'
export const rulebookFile = 'R20 - rulebook.md';
export const themesFile = 'themes comparison.md';


export const _parseContentDeps: parseContentDeps = {
  fileLocations: {
    CompiledFolder,
    themesFile,
    CompiledClassesFolder,
    CompiledSpelllistsFolder,
    ArchetypesFolder,
    ClassesFolder,
    errorsFile,
    SpellDescriptionsFolder,
    SpellsFolder,
    tagGroupsFile,
  }
}
