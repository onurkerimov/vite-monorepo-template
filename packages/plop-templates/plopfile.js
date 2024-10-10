const targetApp = process.env.TARGET_APP || 'example_app'
const cwd = process.cwd()

export default function (plop) {
  plop.setGenerator('app', {
    description: 'Create a new React app',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What is your app\'s name?'
    }],
    actions: [
      {
        type: 'addMany',
        destination: `${cwd}/apps/{{name}}`,
        base: 'app',
        templateFiles: 'app/**/*',
        globOptions: { dot: true },
        force: true
      },
    ]
  });
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
        path: `${cwd}/apps/${targetApp}/src/components/{{pascalCase name}}/{{pascalCase name}}.tsx`,
        templateFile: 'component/Component.tsx.hbs'
      },
      {
        type: 'add',
        path: `${cwd}/apps/${targetApp}/src/components/{{pascalCase name}}/{{pascalCase name}}.module.css`,
        templateFile: 'component/Component.module.css.hbs'
      },
      {
        type: 'add',
        path: `${cwd}/apps/${targetApp}/src/components/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
        templateFile: 'component/Component.test.tsx.hbs'
      },
      {
        type: 'add',
        path: `${cwd}/apps/${targetApp}/src/components/{{pascalCase name}}/index.ts`,
        templateFile: 'component/Component.index.ts.hbs'
      }
    ]
  });
  plop.setGenerator('package', {
    description: 'Create a new package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is your package name?'
      },
      {
        type: 'list',
        name: 'type',
        message: 'What type of package is this?',
        choices: ['library', 'utility', 'component-library'],
        default: 'library'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: `${cwd}/packages/{{kebabCase name}}`,
        base: 'package/{{type}}',
        templateFiles: 'package/{{type}}/**/*',
        globOptions: { dot: true }
      },
      {
        type: 'add',
        path: `${cwd}/packages/{{kebabCase name}}/package.json`,
        templateFile: 'package/package.json.hbs'
      },
      {
        type: 'add',
        path: `${cwd}/packages/{{kebabCase name}}/README.md`,
        templateFile: 'package/README.md.hbs'
      }
    ]
  });
};