const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const glob = require('glob');

async function run() {
    try {
        const foldersToCheck = JSON.parse(core.getInput('folders'));

        const changedFolders = await Promise.all(
            Object.entries(foldersToCheck).map(async ([name, path]) => {
                const isFolderChanged = await checkIfFolderChanged(name, path);
                return {
                    name,
                    changed: isFolderChanged,
                };
            })
        );

        core.setOutput('changed', JSON.stringify(changedFolders));
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function checkIfFolderChanged(name, pattern) {
    const changedFiles = await getChangedFiles();
    const filesToCheck = await getFilesToCheck(pattern);

    return filesToCheck.some(file => changedFiles.includes(file));
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
        head: `${sha}^`,
    });

    return compareCommitsResponse.data.files.map(file => file.filename);
}

async function getFilesToCheck(pattern) {
    return new Promise((resolve, reject) => {
        glob(pattern, { nodir: true }, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    });
}

run();
