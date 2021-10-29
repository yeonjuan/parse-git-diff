const replacer = require('md-replacer');
const path = require('path');
const fs = require('fs');
const parseGitDiff = require('../build/index.umd');

const README_PATH = path.join(__dirname, '../README.md');
const README_INPUT = fs.readFileSync(README_PATH, 'utf-8');

const FIXTURES = [
  'new-file',
  'deleted-file',
  'renamed-file',
  'conflict-file',
  'new-line',
  'deleted-line',
];

let readmeReplacer = replacer().content(README_INPUT);

FIXTURES.map((fixture) => {
  return {
    fixturePath: path.join(__dirname, '../src/__fixtures__', fixture),
    fixture,
  };
})
  .map(({ fixture, fixturePath }) => {
    return {
      content: fs.readFileSync(fixturePath, 'utf8'),
      fixture,
    };
  })
  .forEach(({ content, fixture }) => {
    const inputReplaceName = `${fixture}-input`;
    const outputReplaceName = `${fixture}-output`;
    const parsed = parseGitDiff(content);
    readmeReplacer = readmeReplacer
      .replace(inputReplaceName, () => {
        return '\n```diff\n' + content + `\n\`\`\`\n`;
      })
      .replace(outputReplaceName, () => {
        return '\n```json\n' + JSON.stringify(parsed, null, 2) + '\n```\n';
      });
  });

const result = readmeReplacer.build();

fs.writeFileSync(README_PATH, result, 'utf8');
