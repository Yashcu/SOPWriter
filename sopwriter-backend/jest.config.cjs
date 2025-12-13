module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/**/*.test.ts',
        '!src/index.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 65,  // Current: 66.94% - Realistic target
            functions: 70,  // Current: 74.5% - Met
            lines: 70,      // Current: 80.37% - Met
            statements: 70, // Current: 79.13% - Met
        },
    },
    testTimeout: 60000,
};
