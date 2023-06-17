const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    const pathToCheck = core.getInput('path');
    const changedFiles = await getChangedFiles();

    const isPathChanged = changedFiles.includes(pathToCheck);

    if (isPathChanged) {
      core.setOutput('changed', 'true');
      console.log(`The path "${pathToCheck}" was changed.`);
    } else {
      core.setOutput('changed', 'false');
      console.log(`The path "${pathToCheck}" was not changed.`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
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
