module.exports = async () => {
  return {
    transform: {
      '^.+\\.jsx?$': [
        'esbuild-jest-transform',
        {
          target: 'es2015',
        },
      ],
    },
  };
};
