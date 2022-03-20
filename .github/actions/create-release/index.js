const core = require('@actions/core');
const github = require('@actions/github');

const { owner, repo } = require('../../constants');
const version = core.getInput('version');
const prNumber = core.getInput('pr-num');
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

async function run() {
  try {
    const createReleaseResponse = await octokit.rest.repos.createRelease({
      body: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
      draft: true,
      name: `v${version} - ${new Date().toISOString()}`,
      owner,
      prerelease: false,
      repo,
      tag_name: version,
      target_commitish: 'main',
    });

    const {
      data: { id: releaseId, html_url: htmlUrl, tag_name: tagName },
    } = createReleaseResponse;
    core.debug(`Create release ${tagName} (${releaseId}): ${htmlUrl}.`);
    core.setOutput('releaseId', releaseId);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
