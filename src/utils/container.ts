import Docker from "dockerode";

export async function checkDocker(docker: Docker) {
  try {
    await docker.ping();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('unknown error'); 
    }
    }
}
