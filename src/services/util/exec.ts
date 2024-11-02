import childProcess from "child_process";

const exec = (command: string, options = {}) =>
  new Promise<{ stdout: string, stderr: string }>((resolve, reject) =>
    childProcess.exec(command, options, (error, stdout, stderr) =>
      error ? reject(error) : resolve({ stdout, stderr })
    )
  );

export { exec };

