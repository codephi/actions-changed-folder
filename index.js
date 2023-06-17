const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
    try {
        const foldersToCheck = JSON.parse(core.getInput('folders'));

        const changedFolders = await Promise.all(foldersToCheck.map(async (folder) => {
            const isFolderChanged = await checkIfFolderChanged(folder.name, folder.directory);
            return {
                name: folder.name,
                changed: isFolderChanged
            };
        }));

        core.setOutput('changed', JSON.stringify(changedFolders));
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function checkIfFolderChanged(name, directory) {
    const changedFiles = await getChangedFiles();

    return changedFiles.some(file => file.startsWith(`${directory}/`));
}

async function getChangedFiles() {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;
    const { sha } = github.context.payload.head_commit || github.context.payload.commits[0];

    const compareCommitsResponse = await octokit.repos.compareCommits({
        owner,
        repo,
        base: sha,
        head: `${sha}^`
    });

    return compareCommitsResponse.data.files.map(file => file.filename);
}

run();
