const core = require('@actions/core');
const github = require('@actions/github');

const labelToVersion = {
  'release-major': 'major',
  'release-minor': 'minor',
  'release-patch': 'patch',
};

try {
  const labelNames = github.context.payload.pull_request.labels
    .map((label) => label.name)
    .filter((labelName) => labelToVersion[labelName]);

  if (labelNames.length === 0) {
    core.setFailed('No labels set');
  } else if (labelNames.length > 1) {
    core.setFailed(`Multiple labels set: ${labelNames.join(', ')}`);
  } else {
    core.debug('release-type:', labelToVersion[labelNames[0]]);
    core.setOutput('releaseType', labelToVersion[labelNames[0]]);
  }
} catch (error) {
  core.setFailed(error.message);
}
