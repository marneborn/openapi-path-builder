const core = require('@actions/core');
const github = require('@actions/github');

const { owner, repo } = require('../../constants');

const version = core.getInput('version');
const prNumber = core.getInput('pr-num');
const token = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(token);

async function run() {
  try {
    const createReleaseResponse = await octokit.rest.repos.createRelease({
      body: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
      draft: false,
      name: `v${version} - ${new Date().toISOString()}`,
      owner,
      prerelease: false,
      repo,
      tag_name: version,
      target_commitish: 'main',
    });

    const {
      data: { id: releaseId, html_url: htmlUrl },
    } = createReleaseResponse;
    core.debug(`Create release ${version} (${releaseId}): ${htmlUrl}.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
