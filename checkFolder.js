const core = require('@actions/core');
const github = require('@actions/github');

async function checkFolder() {
    try {
        const folderToCheck = core.getInput('folder');
        const changedFiles = await getChangedFiles();

        for (const file of changedFiles) { 
            if (file.startsWith(folderToCheck)) { 
                core.setOutput('changed', true);
                break;
            }
        }

        core.setOutput('changed', false);
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function getChangedFiles() {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;
    beforeSha = github.context.payload.before;
    afterSha = github.context.payload.after;

    const compareCommitsResponse = await octokit.rest.repos.compareCommitsWithBasehead({
        owner,
        repo,
        basehead: `${beforeSha}...${afterSha}`,
    });

    const files = [];

    compareCommitsResponse.data.files.forEach((file) => {
        files.push(file.filename);
    });

    return files;
}

module.exports = checkFolder;
