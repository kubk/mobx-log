const assetDirectoryNames = new Set([
  'icon',
  'icons',
  'svg',
  'svgs',
  'asset',
  'assets',
]);

function isTestFile(filePath) {
  return (
    filePath.includes('/__tests__/') ||
    filePath.includes('/tests/') ||
    filePath.includes('/test/') ||
    /(?:\.|-|_)test\.[cm]?[jt]sx?$/.test(filePath) ||
    /(?:\.|-|_)spec\.[cm]?[jt]sx?$/.test(filePath)
  );
}

const directoryFileLimitRule = {
  id: 'local/directory-file-limit',
  family: 'structure',
  severity: 'medium',
  scope: 'directory',
  requires: [],
  supports(context) {
    return context.scope === 'directory' && Boolean(context.directory);
  },
  evaluate(context) {
    const directory = context.directory;
    if (!directory || directory.path === '.') {
      return [];
    }

    const fileCount = directory.filePaths.length;
    const testFileCount = directory.filePaths.filter(isTestFile).length;
    const testFileRatio = fileCount === 0 ? 0 : testFileCount / fileCount;
    const isAssetDirectory = directory.path
      .split('/')
      .some((segment) => assetDirectoryNames.has(segment.toLowerCase()));
    if (isAssetDirectory || testFileRatio >= 0.8) {
      return [];
    }

    const configuredMaxFiles = context.ruleConfig?.options?.maxFiles;
    const maxFiles =
      typeof configuredMaxFiles === 'number' &&
      Number.isInteger(configuredMaxFiles) &&
      configuredMaxFiles > 0
        ? configuredMaxFiles
        : 30;
    if (fileCount <= maxFiles) {
      return [];
    }

    return [
      {
        ruleId: 'local/directory-file-limit',
        family: 'structure',
        severity: 'medium',
        scope: 'directory',
        path: directory.path,
        message: `Directory exceeds the file-count limit (${fileCount} files; limit ${maxFiles})`,
        evidence: [`fileCount=${fileCount}`, `maxFiles=${maxFiles}`],
        score: 2 + Math.min(4, fileCount / maxFiles),
        locations: [{ path: directory.path, line: 1 }],
      },
    ];
  },
};

export default {
  plugins: {
    local: {
      meta: {
        name: 'mobx-log slop rules',
        namespace: 'local',
        apiVersion: 1,
      },
      rules: {
        'directory-file-limit': directoryFileLimitRule,
      },
    },
  },
  rules: {
    'structure.barrel-density': { enabled: false },
    'structure.directory-fanout-hotspot': { enabled: false },
    'local/directory-file-limit': { enabled: true, options: { maxFiles: 30 } },
  },
};
