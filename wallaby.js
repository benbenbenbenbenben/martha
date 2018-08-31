module.exports = function() {
    return {
      files: [
        '!**/*.spec.ts',
        'src/**/*.ts'
      ],
      tests: [
        'test/**/*.spec.ts'
      ],
      debug: false,
      testFramework: 'mocha',
      env: {
        type: 'node'
      },
    };
  };