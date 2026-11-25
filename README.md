# OpenFit

OpenFit is a free native mobile app for assissting exercise and fitness, built in React Native using Expo. It is designed for people who want to
plan and record their training on a phone without paying for a subscription.

**Status**: OpenFit is in early development. Currently template CRUD operations using local device storage with SQLite is supported. The RepDB exercise catalog is bundled into the app download, and supports search and filtering by muscle.

## Contributing

Contributors of all skill levels are welcome! For instructions on how to get involved and contribute, see the [contributing guidelines](./CONTRIBUTING.md). It will outline communication standards, how to setup your development environment for OpenFit, and where to find good first issues to work on.

## Quickstart

With Node.js 24 LTS and Expo Go for SDK 58 installed:

```sh
npm ci
npm start
```

Connect your phone to the same Wi-Fi network and scan the terminal QR code.
The app needs no backend credentials. See the [setup guide](./docs/setup.md) for
launch instructions, validation commands, and offline device review.

## Design

The design document for this project is found [here](./docs/design.md). It outlines the following elements of the project:

- Context and scope
- Goals and non-goals
- System-context diagram
- Architecture and components
- Data model
- Technology choices and alternatives considered 
- Risks and open questions
- Implementation plan 

This is the starting point for understanding this project. 

Other docs include the [architecture decision records](./docs/adr/README.md) that explain build decisions made thus far.

Documents intended for AI agents are stored in `agent-docs/`

## Roadmap

See the [roadmap](./docs/roadmap.md) for the scoped MVP and its two milestones,
features planned next, longer-term ideas, and features outside the current plan.

Track current work, priorities, and milestone progress on the
[OpenFit MVP project board](https://github.com/orgs/open-source-fitness/projects/1).

## Maintainers:

- James Teuscher

## License

Exercise data by [RepDB](https://repdb.co), bundled from its free-tier package.
The exercise data has its own [data license](https://github.com/RepDB/exercise-dataset/blob/main/LICENSE-DATA.md).

This project uses the Gnu General Public License (GPL) to keep the code open to the public.

This license was selected to ensure the fulfillment of the project's purpose: providing exercise and fitness tool to the general public free of charge. This license aids that purpose by ensuring that any replications or extensions of this source code remains open source and available to the public. 
