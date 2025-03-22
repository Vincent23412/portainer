import { Router, Request, Response } from "express";
import * as containerFunction from "../controllers/containerController";
import { ContainerInfo } from "dockerode";

const router = Router();

router.get("/list", async (req: Request, res: Response) => {
  try {
    const list: ContainerInfo[] | null =
      await containerFunction.listAllContainer();
    res.status(200).send(list);
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.get("/list/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const list: ContainerInfo[] = await containerFunction.listAllContainer();
    let find: ContainerInfo | null = null;
    for (let i = 0; i < list.length; i++) {
      if (list[i].Id === id) {
        find = list[i];
        break;
      }
    }
    res.status(200).send({ item: find });
  } catch (e) {
    res.status(400).send({ error: e });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { image, name }: { image: string; name: string } = req.body;
    const container = await containerFunction.createPersistentContainer(
      image,
      name
    );
    res.status(200).send({ containerInfo: (await container.inspect()).Id });
  } catch (e) {
    console.log("error", e);
    res.status(400).send(e);
  }
});

router.post("/exec", async (req: Request, res: Response) => {
  try {
    const { id, command } = req.body;
    console.log("id", id, command);
    const response = await containerFunction.doCommand(id, command);
    console.log(response);
    res.status(200).send({ response });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/", async (req: Request, res: Response) => {
  try {
    const { containerId }: { containerId: string } = req.body;
    await containerFunction.deleteContainer(containerId);
    res.status(200).send({ status: "success" });
  } catch (error) {
    let message = ''; 
    if (error instanceof Error) {
      message = error.message; 
    } else {
      message = 'unknown error'
    }
    res.status(400).send({ error: message });
  }
});

export default router;
