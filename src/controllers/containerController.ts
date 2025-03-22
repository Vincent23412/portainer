import Docker, { ContainerInfo } from "dockerode";
import { Readable, Writable } from "stream";
import { checkDocker } from "../utils/container";
import { createShellSession } from "../utils/session";

const docker: Docker = new Docker();
const activeSessions: Record<
  string,
  { exec: Docker.Exec; stdin: Writable; stdout: Readable }
> = {};

(async () => {
  await checkDocker(docker);
})()


async function listAllContainer() {
  try {
    const containers: ContainerInfo[] = await docker.listContainers({
      all: true,
    });
    return containers;
  } catch (error) {
    console.error("Error listing containers:", error);
    return [];
  }
}

async function createPersistentContainer(
  image: string,
  containerName: string = "container"
) {
  try {
    const existingContainers = await docker.listContainers({ all: true });
    const existingContainer = existingContainers.find((c) =>
      c.Names.includes(`/${containerName}`)
    );

    if (existingContainer) {
      console.log(existingContainer.Id);
      const container = docker.getContainer(existingContainer.Id);
      try {
        await container.start();
      } catch (e) {}

      return container;
    }
    const container = await docker.createContainer({
      Image: image,
      name: containerName,
      Tty: true,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin: true,
      StdinOnce: false,
      HostConfig: {
        RestartPolicy: { Name: "always" },
        Binds: ["/data:/app/data"],
      },
    });

    await container.start();
    return container;
  } catch (error) {
    throw error;
  }
}

async function doCommand(id: string, command: string) {
  try {
    if (!id || !command) {
      throw new Error("no command");
    }

    console.log(`exec ${command}」 in container ${id}`);

    const session = await createShellSession(activeSessions, docker, id);

    session.stdin.write(command + "\n");

    let output = "";
    const readStream = session.stdout;

    readStream.on("data", (chunk) => {
      output += chunk.toString();
    });

    await new Promise((resolve) => setTimeout(resolve, 500)); 
    return output;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(msg);
  }
}

async function deleteContainer(id: string) {
  console.log(activeSessions);
  try {
    const container = docker.getContainer(id);
    await container.stop();
    await container.remove();
    delete activeSessions[id];
    console.log(activeSessions);
  } catch (e) {
    console.error(`delete error ${id}: ${e}`);
    throw new Error(`delete error ${id}: ${e}`);
  }
}

export {
  listAllContainer,
  createPersistentContainer,
  doCommand,
  deleteContainer,
};
