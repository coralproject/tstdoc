# `@coralproject/tstdoc`

![npm (scoped)](https://img.shields.io/npm/v/@coralproject/tstdoc)
![CircleCI](https://img.shields.io/circleci/project/github/coralproject/tstdoc.svg)

This projects serves to provide a way to document Typescript interfaces in
Markdown.

## Installation

```sh
yarn add -D @coralproject/tstdoc

# OR

npm install -D @coralproject/tstdoc
```

## CLI

```sh
# This is actually used to generate the documentation below!
tstdoc README.md
```

## API

```ts
import generate from "@coralproject/tstdoc";

// ...

const documentation = await generate(options);
```

### Options

Below is the documentation for the options passed into `generate` for
programmably creating documentation.

<!-- START tstdoc:generate(src/generate.ts, Options, 4) -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN tstdoc TO UPDATE -->

#### Parameters

##### `fileName` _(string)_

fileName is the file that contains the typescript type that you want to generate documentation for.


##### `indent` _(number)_

indent is the number of header characters to start each header with (minimum 1).


##### `symbolNames` _(array)_

symbolNames are the symbols in the file that you want to generate documentation for.



<!-- END tstdoc -->

## License

This project is released under the [Apache License, v2.0](/LICENSE).
