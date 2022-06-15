# Post compilation issue

## To build the project
`yarn rebuild`

## To run the test
`yarn test`



1. Invalid wasm module found error.

```log
✔ Artifacts written to ./build from the image `polywrap-build-env-14e5bc2f-c207-45ff-977d-cf7450e60b74`
✖ Failed to compile Web3API: Invalid Wasm module found. `mutation` at <home>/integrations/protocol/substrate/core-wrapper/build/mutation.wasm is invalid. Error: ,TypeError: Cannot create proxy with a non-object as target or handler
Error: Invalid Wasm module found. `mutation` at <home>/integrations/protocol/substrate/core-wrapper/build/mutation.wasm is invalid. Error: ,TypeError: Cannot create proxy with a non-object as target or handler
    at Compiler.<anonymous> (<home>/integrations/protocol/substrate/core-wrapper/node_modules/@web3api/cli/build/lib/Compiler.js:680:31)
    at step (<home>/integrations/protocol/substrate/core-wrapper/node_modules/@web3api/cli/build/lib/Compiler.js:54:23)
    at Object.throw (<home>/integrations/protocol/substrate/core-wrapper/node_modules/@web3api/cli/build/lib/Compiler.js:35:53)
    at rejected (<home>/integrations/protocol/substrate/core-wrapper/node_modules/@web3api/cli/build/lib/Compiler.js:27:65)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

- This happens when trying to a more complex types in substrate crates such as `sp-core`, `sp-runtime`, `sp-version`, etc.
