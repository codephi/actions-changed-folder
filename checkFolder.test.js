const { getInput, setOutput, setFailed } = require('@actions/core');
const { getOctokit, context } = require('@actions/github');
const checkFolder = require('./checkFolder');

// Mock das funções getInput, setOutput e setFailed
jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
    setOutput: jest.fn(),
    setFailed: jest.fn(),
}));

// Mock da função getOctokit
jest.mock('@actions/github', () => ({
    getOctokit: jest.fn(() => ({
        rest: {
            repos: {
                compareCommitsWithBasehead: jest.fn().mockResolvedValue({
                    data: {
                        files: [
                            { filename: 'path/to/file1' },
                            { filename: 'path/to/file2' },
                            { filename: 'other/path/file3' },
                        ],
                    },
                }),
            },
        },
    })),
    context: {
        repo: {
            owner: 'owner',
            repo: 'repo',
        },
        payload: {
            before: 'before_sha',
            after: 'after_sha',
        },
    },
}));

describe('checkFolder', () => {
    afterEach(() => {
        // Limpa os mocks após cada teste
        jest.clearAllMocks();
    });

    test('should set output to true if folder is changed', async () => {
        // Configuração do mock para getInput
        getInput.mockImplementation((name) => {
            if (name === 'folder') {
                return 'path/to';
            }
        });

        // Chama a função a ser testada
        await checkFolder();

        // Verifica se a saída foi definida corretamente
        expect(setOutput).toHaveBeenCalledWith('changed', true);
    });

    test('should set output to false if folder is not changed', async () => {
        // Configuração do mock para getInput
        getInput.mockImplementation((name) => {
            if (name === 'folder') {
                return 'other/path';
            }
        });

        // Chama a função a ser testada
        await checkFolder();

        // Verifica se a saída foi definida corretamente
        expect(setOutput).toHaveBeenCalledWith('changed', false);
    });
});
