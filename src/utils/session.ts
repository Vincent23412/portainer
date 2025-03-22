import Docker, { ContainerInfo } from "dockerode";
import { Readable, Writable } from "stream";

export async function createShellSession(
  activeSessions: Record<
    string,
    { exec: Docker.Exec; stdin: Writable; stdout: Readable }
  >,
  docker: Docker,
  containerId: string
) {
  if (activeSessions[containerId]) {
    console.log(`${containerId} already have shell`);
    return activeSessions[containerId]; 
  }

  const container = docker.getContainer(containerId);
  const exec = await container.exec({
    AttachStdout: true,
    AttachStderr: true,
    AttachStdin: true,
    Tty: true, 
    Cmd: ["/bin/sh"], 
  });

  const stream = await exec.start({ hijack: true, stdin: true });

  const stdin = new Writable({
    write(chunk, encoding, callback) {
      stream.write(chunk, encoding, callback);
    },
  });

  const stdout = new Readable({
    read() {},
  });

  stream.on("data", (chunk) => {
    stdout.push(chunk); // 把 Shell 輸出寫入 stdout
  });

  stream.on("end", () => {
    console.log(`${containerId} stop`);
    delete activeSessions[containerId]; // 清除終止的 Session
  });

  activeSessions[containerId] = { exec, stdin, stdout };

  console.log(`create ${containerId} shell`);
  return activeSessions[containerId];
}
