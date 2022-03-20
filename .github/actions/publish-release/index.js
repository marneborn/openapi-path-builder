const core = require('@actions/core');
const github = require('@actions/github');

const version = core.getInput('version');
const releaseId = core.getInput('releaseId');
const token = core.getInput('GITHUB_TOKEN');
const octokit = github.getOctokit(token);

async function run() {
  try {
    const createReleaseResponse = await octokit.rest.repos.updateRelease({
      draft: false,
      release_id: releaseId,
    });

    const {
      data: { id: releaseId, html_url: htmlUrl, tag_name: tagName },
    } = createReleaseResponse;
    core.debug(`Published release ${tagName} (${releaseId}): ${htmlUrl}.`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
