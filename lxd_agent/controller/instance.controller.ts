import { Request, Response } from "express";
import send from "../utils/response/index.js";
import { logger } from "../utils/logger/logger.utils.js";

export const createInstance = async (req: Request, res: Response) => {
  try {
    const { id, rootPassword, ipAddress, vCPU, memory, storage } = req.body;

    if (
      id === undefined ||
      rootPassword === undefined ||
      ipAddress === undefined ||
      vCPU === undefined ||
      memory === undefined ||
      storage === undefined
    ) {
      logger.log({
        ip: req.ip,
        message: `[validator]: Failed validation check.`,
        type: "error",
        route: "POST /instnace",
      });
      send.badRequest(res);
    } else {
      // creates new instance
      const lxdResponse: any = await (
        await fetch(
          `${process.env.LXD_SERVER}/1.0/instances?project=${process.env.PROJECT}`,
          {
            method: "POST",
            body: JSON.stringify({
              name: `${id}`,
              config: {
                "cloud-init.network-config": `network:\n  version: 2\n  ethernets:\n    enp5s0:\n      dhcp4: false\n      addresses:\n        - ${ipAddress}/24\n      gateway4: 10.10.10.1\n      nameservers:\n        addresses: [10.10.10.1,8.8.8.8]\n\n`,
                "cloud-init.user-data": `#cloud-config\nchpasswd:\n  expire: false\n  users:\n  - {name: root, password: ${rootPassword}, type: text}\nssh_pwauth: true\ndisable_root: true\nruncmd:\n  - echo "PermitRootLogin yes" > /etc/ssh/sshd_config.d/custom-cloud-init.conf\n  - systemctl restart ssh`,
                "limits.cpu": `${vCPU}`,
                "limits.memory": `${memory}GiB`,
              },
              devices: {
                root: {
                  path: "/",
                  pool: `${process.env.LXD_STORAGE_POOL}`,
                  type: `${process.env.LXD_STORAGE_POOL_TYPE}`,
                  size: `${storage}GiB`,
                },
              },
              source: {
                alias: "24.04",
                protocol: "simplestreams",
                server: "https://cloud-images.ubuntu.com/releases/",
                type: "image",
              },
              "boot.autostart": false,
              start: true,
              type: "virtual-machine",
            }),
          },
        )
      ).json();

      if (lxdResponse.status_code === 100) {
        await logger.log({
          ip: req.ip,
          type: "success",
          message: "Instance created successfully.",
          route: "POST /instance",
        });
        send.ok(res);
      } else {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: "Failed to create instance.",
          route: "POST /instance",
        });
        send.internalError(res);
      }
    }
  } catch (error) {
    await logger.log({
      ip: req.ip,
      type: "error",
      message: "Failed to create instance.",
      route: "POST /instance",
    });
    send.internalError(res);
  }
};

export const getAllInstance = async (req: Request, res: Response) => {
  try {
    // get indivisual instance
    const lxdResponse: any = await (
      await fetch(
        `${process.env.LXD_SERVER}/1.0/instances?project=${process.env.PROJECT}&recursion=2`,
      )
    ).json();

    if (lxdResponse.status_code === 200) {
      send.ok(res, "", lxdResponse);
    } else {
      await logger.log({
        ip: req.ip,
        type: "error",
        message: "Failed to get instances.",
        route: "GET /instance",
      });
      send.internalError(res);
    }
  } catch (error) {
    await logger.log({
      ip: req.ip,
      type: "error",
      message: "Failed to get instances.",
      route: "GET /instance",
    });
    send.internalError(res);
  }
};

export const getIndivisualInstance = async (req: Request, res: Response) => {
  try {
    const id = req.params.vmId;

    if (id === undefined) {
      send.badRequest(res);
    } else {
      // get indivisual instance
      const lxdResponse: any = await (
        await fetch(
          `${process.env.LXD_SERVER}/1.0/instances/${id}?project=${process.env.PROJECT}&recursion=1`,
        )
      ).json();

      if (lxdResponse.status_code === 200) {
        send.ok(res, "", lxdResponse);
      } else if (lxdResponse.error_code === 404) {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: `Instance ${id} does not exists.`,
          route: "GET /instance/:id",
        });
        send.notFound(res);
      } else {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: `Error getting instance ${id} server responded with ${lxdResponse.status_code} code.`,
          route: "GET /instance/:id",
        });
        send.internalError(res);
      }
    }
  } catch (error) {
    await logger.log({
      ip: req.ip,
      type: "error",
      message: `Failed to get instance ${req.params.vmId}.`,
      route: "GET /instance/:id",
    });
    send.internalError(res);
  }
};

export const startInstance = async (req: Request, res: Response) => {
  try {
    const id = req.params.vmId;

    if (id === undefined) {
      send.badRequest(res);
    } else {
      // start instance
      const lxdResponse: any = await (
        await fetch(
          `${process.env.LXD_SERVER}/1.0/instances/${id}/state?project=${process.env.PROJECT}`,
          {
            method: "PUT",
            body: JSON.stringify({ action: "start" }),
          },
        )
      ).json();

      if (lxdResponse.status_code === 100) {
        await logger.log({
          ip: req.ip,
          type: "success",
          message: `Starting Instnace ${req.params.vmId}.`,
          route: "PUT /instance/:id/start",
        });
        send.ok(res);
      } else {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: `Can not start instance, server responded with ${lxdResponse.status_code} code.`,
          route: "PUT /instance/:id/start",
        });
        send.internalError(res);
      }
    }
  } catch (error) {
    await logger.log({
      ip: req.ip,
      type: "error",
      message: `Failed to start instance ${req.params.vmId}.`,
      route: "PUT /instance/:id/start",
    });
    send.internalError(res);
  }
};

export const stopInstance = async (req: Request, res: Response) => {
  try {
    const id = req.params.vmId;

    if (id === undefined) {
      send.badRequest(res);
    } else {
      // stop instance
      const lxdResponse: any = await (
        await fetch(
          `${process.env.LXD_SERVER}/1.0/instances/${id}/state?project=${process.env.PROJECT}`,
          {
            method: "PUT",
            body: JSON.stringify({ action: "stop", force: true }),
          },
        )
      ).json();

      if (lxdResponse.status_code === 100) {
        await logger.log({
          ip: req.ip,
          type: "success",
          message: `Stopping instnace ${id}.`,
          route: "PUT /instance/:id/stop",
        });
        send.ok(res);
      } else {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: `Failed to stop instance, server responded with ${lxdResponse.status_code} code.`,
          route: "PUT /instance/:id/stop",
        });
        send.internalError(res);
      }
    }
  } catch (error) {
    await logger.log({
      ip: req.ip,
      type: "error",
      message: `Failed to stop instance ${req.params.vmId}.`,
      route: "PUT /instance/:id/stop",
    });
    send.internalError(res);
  }
};

export const restartInstance = async (req: Request, res: Response) => {
  try {
    const id = req.params.vmId;

    if (id === undefined) {
      send.badRequest(res);
    } else {
      // start restart instance
      const lxdResponse: any = await (
        await fetch(
          `${process.env.LXD_SERVER}/1.0/instances/${id}/state?project=${process.env.PROJECT}`,
          {
            method: "PUT",
            body: JSON.stringify({ action: "restart" }),
          },
        )
      ).json();

      if (lxdResponse.status_code === 100) {
        await logger.log({
          ip: req.ip,
          type: "success",
          message: `Restarting instance ${id}.`,
          route: "PUT /instance/:id/restart",
        });
        send.ok(res);
      } else {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: `Failed to restart instance ${id}.`,
          route: "PUT /instance/:id/restart",
        });
        send.internalError(res);
      }
    }
  } catch (error) {
    await logger.log({
      ip: req.ip,
      type: "error",
      message: `Failed to restart instance ${req.params.vmId}.`,
      route: "PUT /instance/:id/restart",
    });
    send.internalError(res);
  }
};

export const destroyInstance = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (id === undefined) {
      send.badRequest(res);
    } else {
      // delete request
      const lxdResponse: any = await (
        await fetch(
          `${process.env.LXD_SERVER}/1.0/instances/${id}?project=${process.env.PROJECT}`,
          {
            method: "DELETE",
          },
        )
      ).json();

      if (lxdResponse.status_code === 100) {
        await logger.log({
          ip: req.ip,
          type: "success",
          message: `Deleting instance ${id}.`,
          route: "DELETE /instance",
        });
        send.ok(res);
      } else if (lxdResponse.error_code === 404) {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: `Can not delete instance ${id}, instance not found.`,
          route: "DELETE /instance",
        });
        send.notFound(res, "instance not found");
      } else {
        await logger.log({
          ip: req.ip,
          type: "error",
          message: `Can not delete instance, server responded with ${lxdResponse.status_code} code.`,
          route: "DELETE /instance",
        });
        send.internalError(res);
      }
    }
  } catch (error) {
    await logger.log({
      ip: req.ip,
      type: "error",
      message: `Failed to delete instance ${req.body.id}.`,
      route: "DELETE /instance",
    });
    send.internalError(res);
  }
};
