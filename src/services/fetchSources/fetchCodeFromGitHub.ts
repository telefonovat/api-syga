const repoPrefix = `https:/raw.githubusercontent.com/telefonovat/syga--algorithms/main`;
const directoryPrefix = `algorithm`;
export async function fetchCodeFromGithub(
  path: string,
): Promise<string> {
  const resourceUrl = `${repoPrefix}/${directoryPrefix}/${path}`;

  const response = await fetch(resourceUrl);
  if (!response.ok) {
    throw new Error(
      'Cannot fetch resource. Are you sure you have the correct path?',
    );
  }

  const content = await response.text();

  return content;
}
