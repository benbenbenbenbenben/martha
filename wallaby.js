module.exports = function() {
    return {
      files: [
        '!**/*.spec.ts',
        '**/*.ts'
      ],
      tests: [
        'test/**/*.spec.ts'
      ],
      debug: true,
      testFramework: 'mocha',
      env: {
        type: 'node'
      }
    };
  };