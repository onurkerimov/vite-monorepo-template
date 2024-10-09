export default function (plop) {
  plop.setGenerator('component', {
    description: 'Create a new React component',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What is your component name?'
    }],
    actions: [{
      type: 'add',
      path: 'apps/main/src/components/{{pascalCase name}}/{{pascalCase name}}.jsx',
      templateFile: 'packages/plop-templates/Component.tsx.hbs'
    }]
  });
};