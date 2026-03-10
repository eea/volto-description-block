# volto-description-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-description-block)](https://github.com/eea/volto-description-block/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-description-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-description-block/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-description-block%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-description-block/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-description-block&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-description-block&branch=develop)


[Volto](https://github.com/plone/volto) Description block based on [volto-slate](https://github.com/eea/volto-slate) that automatically strips HTML and updates Document description metadata field.

## Features

[![Description Block](https://raw.githubusercontent.com/eea/volto-description-block/master/docs/description.gif)](https://youtu.be/JG_p85tOZi0)

## Getting started

### Try volto-description-block with Docker

      git clone https://github.com/eea/volto-description-block.git
      cd volto-description-block
      make
      make start

Go to http://localhost:3000

`make start` now defaults to Volto 18. To run the same setup against Volto 17, use:

      VOLTO_VERSION=17 make
      VOLTO_VERSION=17 make start

### Add volto-description-block to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-description-block"
   ],

   "dependencies": {
       "@eeacms/volto-description-block": "*"
   }
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

   For a legacy Volto 17 project, install the package with `yarn` and restart the frontend as usual.

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-description-block/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-description-block/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-description-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
