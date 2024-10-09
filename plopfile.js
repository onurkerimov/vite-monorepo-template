export default function (plop) {
  plop.setGenerator('component', {
    description: 'Create a new React component',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What is your component name?'
    }],
    actions: [
      {
        type: 'add',
        path: 'apps/main/src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'packages/plop-templates/Component/Component.tsx.hbs'
      },
      {
        type: 'add',
        path: 'apps/main/src/components/{{pascalCase name}}/{{pascalCase name}}.module.css',
        templateFile: 'packages/plop-templates/Component/Component.module.css.hbs'
      },
      {
        type: 'add',
        path: 'apps/main/src/components/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
        templateFile: 'packages/plop-templates/Component/Component.test.tsx.hbs'
      },
      {
        type: 'add',
        path: 'apps/main/src/components/{{pascalCase name}}/index.ts',
        templateFile: 'packages/plop-templates/Component/Component.index.ts.hbs'
      }
    ]
  });
};