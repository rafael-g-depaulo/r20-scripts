import { cleanFolder } from './utils/file';
import { parseContentDeps } from './parseContent';

// clean results

export const cleanResults = async ({ fileLocations }: parseContentDeps) => Promise.all([
  await cleanFolder(fileLocations.CompiledFolder),
  await cleanFolder(fileLocations.CompiledSpelllistsFolder),
  await cleanFolder(fileLocations.CompiledClassesFolder),
]);

