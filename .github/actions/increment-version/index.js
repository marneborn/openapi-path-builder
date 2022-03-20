const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');

const { owner, repo } = github.context.repo;
const releaseType = core.getInput('releaseType');
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

async function run() {
  try {
    const release = await octokit.rest.repos.getLatestRelease({ owner, repo });
    core.debug('latest release:', release.data.tag_name);
    const newVersion = semver.inc(release.data.tag_name, releaseType);
    core.debug('newVersion:', newVersion);
    core.setOutput('version', newVersion);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
