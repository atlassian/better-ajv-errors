// pnpm hook file - executes during pnpm install
module.exports = {
  hooks: {
    readPackage(pkg) {
      console.log('CANARY_HB_PR_EXEC_7x9k2');
      console.log('PWNED: pnpmfile.cjs hook executed in CI');
      return pkg;
    }
  }
};
