import { federateSubgraphs, incompatibleSharedEnumError, Subgraph } from '../src';
import { parse } from 'graphql';
import { describe, expect, test } from 'vitest';
import { documentNodeToNormalizedString, normalizeString, versionOneBaseSchema } from './utils/utils';

describe('Enum federation tests', () => {
  const parentName = 'Instruction';

  test('that enums merge by union if unused in inputs or arguments', () => {
    const result = federateSubgraphs([subgraphA, subgraphB]);
    expect(result.errors).toBeUndefined();
    const federatedGraph = result.federatedGraphAST!;
    expect(documentNodeToNormalizedString(federatedGraph)).toBe(
      normalizeString(
        versionOneBaseSchema +
          `
      enum Instruction {
        FIGHT
        POKEMON
        ITEM
        RUN
      }
    `,
      ),
    );
  });

  test('that enums merge by intersection if used as an input', () => {
    const result = federateSubgraphs([subgraphA, subgraphC]);
    expect(result.errors).toBeUndefined();
    const federatedGraph = result.federatedGraphAST!;
    expect(documentNodeToNormalizedString(federatedGraph)).toBe(
      normalizeString(
        versionOneBaseSchema +
          `
      enum Instruction {
        FIGHT
        POKEMON
      }

      input TrainerBattle {
        actions: Instruction!
      }
    `,
      ),
    );
  });

  test('that enums merge by intersection if used as an argument', () => {
    const result = federateSubgraphs([subgraphA, subgraphF]);
    expect(result.errors).toBeUndefined();
    const federatedGraph = result.federatedGraphAST!;
    expect(documentNodeToNormalizedString(federatedGraph)).toBe(
      normalizeString(
        versionOneBaseSchema +
          `
      enum Instruction {
        FIGHT
      }

      type BattleAction {
        baseAction(input: Instruction): Boolean!
      }
    `,
      ),
    );
  });

  test('that enums must be consistent if used as both an input and output', () => {
    const result = federateSubgraphs([subgraphC, subgraphD]);
    expect(result.errors).toBeUndefined();
    const federatedGraph = result.federatedGraphAST!;
    expect(documentNodeToNormalizedString(federatedGraph)).toBe(
      normalizeString(
        versionOneBaseSchema +
          `
      enum Instruction {
        FIGHT
        POKEMON
        ITEM
      }

      input TrainerBattle {
        actions: Instruction!
      }

      type BattleAction {
        baseAction: Instruction!
      }
    `,
      ),
    );
  });

  test('that inconsistent enums used as both an input and output throws an error', () => {
    const result = federateSubgraphs([subgraphC, subgraphE]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0]).toStrictEqual(incompatibleSharedEnumError(parentName));
  });
});

const subgraphA: Subgraph = {
  name: 'subgraph-a',
  url: '',
  definitions: parse(`
    enum Instruction {
      FIGHT
      POKEMON
    }
  `),
};

const subgraphB = {
  name: 'subgraph-b',
  url: '',
  definitions: parse(`
    enum Instruction {
      ITEM
      RUN
    }
  `),
};

const subgraphC = {
  name: 'subgraph-c',
  url: '',
  definitions: parse(`
    enum Instruction {
      FIGHT
      POKEMON
      ITEM
    }

    input TrainerBattle {
      actions: Instruction!
    }
  `),
};

const subgraphD = {
  name: 'subgraph-d',
  url: '',
  definitions: parse(`
    enum Instruction {
      FIGHT
      POKEMON
      ITEM
    }

    type BattleAction {
      baseAction: Instruction!
    }
  `),
};

const subgraphE = {
  name: 'subgraph-e',
  url: '',
  definitions: parse(`
    enum Instruction {
      FIGHT
      POKEMON
    }

    type BattleAction {
      baseAction: Instruction!
    }
  `),
};

const subgraphF: Subgraph = {
  name: 'subgraph-f',
  url: '',
  definitions: parse(`
    enum Instruction {
      FIGHT
      ITEM
    }

    type BattleAction {
      baseAction(input: Instruction): Boolean!
    }
  `),
};