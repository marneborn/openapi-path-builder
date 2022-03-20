const core = require('@actions/core');
const github = require('@actions/github');

const releaseId = core.getInput('releaseId');
const token = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(token);

async function run() {
  try {
    const updateReleaseResonse = await octokit.rest.repos.updateRelease({
      draft: false,
      release_id: releaseId,
    });

    const {
      data: { html_url: htmlUrl, tag_name: tagName },
    } = updateReleaseResonse;
    core.debug(`Published release ${tagName} (${releaseId}): ${htmlUrl}.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
