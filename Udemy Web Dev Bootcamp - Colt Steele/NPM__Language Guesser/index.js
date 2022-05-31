import {franc, francAll} from 'franc'
import langs from 'langs'

const input = process.argv[2];
const langCode = franc(input);
if (langCode === 'und') {
    console.log("Sorry, we have no idea");
} else {
    const language = langs.where("3", langCode);
    console.log(`Our best guess is: ${language.name}`);
}