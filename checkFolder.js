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

        core.setOutput('changed', JSON.stringify(changed));
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function getChangedFiles() {
    const token = process.env.GITHUB_TOKEN;
    const octokit = github.getOctokit(token);

    const { owner, repo } = github.context.repo;
    const { sha } = github.context.payload.head_commit;

    console.log(github.context.repo)
    console.log(github.context.payload.head_commit)

    const compareCommitsResponse = await octokit.rest.repos.compareCommits({
        owner,
        repo,
        base: sha,
        head: '',
    });

    const files = [];

    compareCommitsResponse.data.files.forEach((file) => {
        files.push(file.filename);
    });

    return files;
}

module.exports = checkFolder;
