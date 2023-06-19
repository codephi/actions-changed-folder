const checkFolder = require('./checkFolder');

// Mock dos módulos '@actions/core' e '@actions/github'
jest.mock('@actions/core', () => ({
    getInput: jest.fn(),
    setOutput: jest.fn(),
    setFailed: jest.fn(),
}));

jest.mock('@actions/github', () => ({
    getOctokit: jest.fn(() => ({
        repos: {
            compareCommits: jest.fn().mockResolvedValue({
                data: {
                    files: [
                        { filename: 'path/to/file1' },
                        { filename: 'path/to/file2' },
                        { filename: 'other/path/file3' },
                    ],
                },
            }),
        },
    })),
    context: {
        repo: {
            owner: 'owner',
            repo: 'repo',
        },
        payload: {
            head_commit: {
                sha: 'commit_sha',
            },
        },
    },
}));

describe('checkFolder', () => {
    it('should correctly check modified folders', async () => {
        // Mock da entrada 'folders' contendo duas pastas
        const mockGetInput = jest.fn().mockReturnValue(JSON.stringify({
            folder1: 'path/nojes',
            folder2: 'other/path',
        }));
        require('@actions/core').getInput = mockGetInput;

        await checkFolder();

        // Verifica se a saída 'changed' foi definida corretamente
        expect(require('@actions/core').setOutput).toHaveBeenCalledWith('changed', JSON.stringify({
            folder1: false,
            folder2: true,
        }));
    });

    it('should handle errors', async () => {
        // Mock de getInput para lançar um erro
        const mockGetInput = jest.fn(() => {
            throw new Error('Input error');
        });
        require('@actions/core').getInput = mockGetInput;

        await checkFolder();

        // Verifica se setFailed foi chamado com a mensagem de erro adequada
        expect(require('@actions/core').setFailed).toHaveBeenCalledWith('Input error');
    });
});
