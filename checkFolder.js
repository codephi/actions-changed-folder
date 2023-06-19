const core = require('@actions/core');
const github = require('@actions/github');

async function checkFolder() {
    try {
        const foldersToCheck = JSON.parse(core.getInput('folders'));
        const changedFiles = await getChangedFiles();

        const changed = {}

        Object.entries(foldersToCheck).map(async ([name, path]) => {
            changed[name] = false;

            changedFiles.forEach((file) => {
                if (file.startsWith(path)) {
                    changed[name] = true;
                }
             })
        })

        console.error.log({ changed })
        core.setOutput('changed', JSON.stringify(changed));
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
