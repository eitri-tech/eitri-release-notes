import { argv } from 'node:process';
import * as fs from 'fs';
import * as yaml from 'yaml';

console.log("Current working directory:", process.cwd());
const args = argv.slice(2);
const langFolder = args[0] === 'en' ? 'en' : 'pt'
const folderPath = `../${langFolder}/docs`
const mdFiles = fs.readdirSync(folderPath, 'utf-8').filter(file => file.endsWith('.md'));
const dateFilesRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}\.md$/;
const dateFilesSet = new Set(mdFiles.filter(fileName => fileName.match(dateFilesRegex)));
const mkDocsYaml = yaml.parseDocument(fs.readFileSync(`../${langFolder}/mkdocs.yml`, 'utf8')).toJSON()
const navItemDatesSet = new Set(mkDocsYaml.nav.map(obj => Object.values(obj)[0]))

if (navItemDatesSet.size !== dateFilesSet.size || !(dateFilesSet.isSubsetOf(navItemDatesSet))) {
    console.log(`There are either missing or extra date files in ${folderPath} or in the ${langFolder} mkdocs.yml file nav section.`)
    console.log('All .md files related to release notes must be in the nav section of the mkdocs.yml file.')
    throw new Error("Mismatch between mkdocs.yml and .md files.");
}

const redirectsPluginIndex = mkDocsYaml.plugins.findIndex(obj => Object.keys(obj)[0] === 'redirects')
const redirectMaps = mkDocsYaml.plugins[redirectsPluginIndex].redirects.redirect_maps

let latestDate = [...dateFilesSet]
  .map(dateStr => {
    dateStr = dateStr.slice(0, -3)
    const [day, month, year] = dateStr.split('-');
    // months in JavaScript Date are 0-indexed (0-11), so we subtract 1 from the month.
    return new Date(year, month - 1, day);
  })
  .reduce((latest, currentDate) => (currentDate > latest ? currentDate : latest));

  latestDate = `${String(latestDate.getDate()).padStart(2, '0')}-${String(latestDate.getMonth() + 1).padStart(2, '0')}-${latestDate.getFullYear()}`;

if (redirectMaps['index.md'] !== `${latestDate}.md`) {
  throw new Error(`index.md redirect in mkdocs.yml is not pointing to the latest release notes file in ${folderPath}`);
}