import { argv } from 'node:process';
import * as fs from 'fs';
import * as yaml from 'yaml';
import stringConstantsFile from './generateTemplateStrings.json' with { type: "json" };

const args = argv.slice(2);
const lang = args[0] === 'pt' ? 'pt' : 'en'
const stringConstants = stringConstantsFile[lang]

const date = new Date();
let currentDate = new Intl.DateTimeFormat("ban", {day: '2-digit', month: '2-digit', year: 'numeric'}).format(date)
currentDate = currentDate.replace(/\//g, '-')
let [month, day, year] = currentDate.split('-');
currentDate = `${day}-${month}-${year}`;

/**
 * 
 * @param {string} sectionName 
 */
function createSection(sectionName, finalSection = false) {
    let sectionString = `## ${sectionName} v.X.X.X\n\n`
    sectionString += createH3Section(stringConstants.new_features)
    sectionString += createH3Section(stringConstants.fixes)
    sectionString += createH3Section(stringConstants.other_changes)

    const sectionTerminator = finalSection ? '\n' : '\n\n'
    sectionString += `---${sectionTerminator}`
    return sectionString
}


function createH3Section(title) {
    const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent viverra 
    magna at mauris fringilla, non condimentum libero tristique. Praesent tempor ullamcorper purus, 
    nec pellentesque ex lacinia ac. Aliquam et odio.`

    return `### ${title}\n\n` + `#### Section Item\n\n${loremIpsum}\n\n`
}

function createPageTemplate() {
    const projects = ["Eitri Machine", "Eitri Shopping", "Eitri Play", "Eitri Luminus"]
    let fileContent = `# Release - ${currentDate}\n\n`

    for (let index = 0; index < projects.length; index++) {
        fileContent += createSection(projects[index], index === projects.length - 1)
    }
    fs.writeFileSync(`../${lang}/docs/${currentDate}.md`, fileContent)
}

function updateYaml() {
    const currentYaml = yaml.parseDocument(fs.readFileSync(`../${lang}/mkdocs.yml`, 'utf8')).toJSON()
    currentYaml.nav.push({[`Release - ${currentDate}`]: `${currentDate}.md`})
    const redirectsPluginIndex = currentYaml.plugins.findIndex(obj => Object.keys(obj)[0] === 'redirects')
    currentYaml.plugins[redirectsPluginIndex].redirects.redirect_maps['index.md'] = `${currentDate}.md`
    fs.writeFileSync(`../${lang}/mkdocs.yml`, yaml.stringify(currentYaml))
}

createPageTemplate()
updateYaml()