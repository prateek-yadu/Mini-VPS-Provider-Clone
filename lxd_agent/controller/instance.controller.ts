import { Request, Response } from "express";
import send from "../utils/response/index.js";

export const createInstance = async (req: Request, res: Response) => {

    try {
        const { id, rootPassword, ipAddress, vCPU, memory, storage } = req.body;

        if (id === undefined || rootPassword === undefined || ipAddress === undefined || vCPU === undefined || memory === undefined || storage === undefined) {
            send.badRequest(res);
        } else {

            // creates new instance
            const lxdResponse: any = await (await fetch(`${process.env.LXD_SERVER}/1.0/instances?project=${process.env.PROJECT}`, {
                method: "POST",
                body: JSON.stringify({
                    "name": `${id}`,
                    "config": {
                        "cloud-init.network-config": `network:\n  version: 2\n  ethernets:\n    enp5s0:\n      dhcp4: false\n      addresses:\n        - ${ipAddress}/24\n      gateway4: 10.10.10.1\n      nameservers:\n        addresses: [10.10.10.1,8.8.8.8]\n\n`,
                        "cloud-init.user-data": `#cloud-config\nchpasswd:\n  expire: false\n  users:\n  - {name: root, password: ${rootPassword}, type: text}\nssh_pwauth: true\ndisable_root: true\nruncmd:\n  - echo "PermitRootLogin yes" > /etc/ssh/sshd_config.d/custom-cloud-init.conf\n  - systemctl restart ssh`,
                        "limits.cpu": `${vCPU}`,
                        "limits.memory": `${memory}GiB`
                    },
                    "devices": {
                        "root": {
                            "path": "/",
                            "pool": `${process.env.LXD_STORAGE_POOL}`,
                            "type": `${process.env.LXD_STORAGE_POOL_TYPE}`,
                            "size": `${storage}GiB`
                        }
                    },
                    "source": {
                        "alias": "24.04",
                        "protocol": "simplestreams",
                        "server": "https://cloud-images.ubuntu.com/releases/",
                        "type": "image"
                    },
                    "boot.autostart": false,
                    "start": true,
                    "type": "virtual-machine"
                })
            })).json();

            if (lxdResponse.status_code === 100) {
                send.ok(res);
            } else {
                send.internalError(res);
            }
        }


    } catch (error) {
        send.internalError(res);
    }
};

export const getAllInstance = async (req: Request, res: Response) => {

    try {
        // get indivisual instance
        const lxdResponse: any = await (await fetch(`${process.env.LXD_SERVER}/1.0/instances?project=${process.env.PROJECT}&recursion=2`)).json();

        if (lxdResponse.status_code === 200) {
            send.ok(res, "", lxdResponse);
        } else {
            send.internalError(res);
        }

    } catch (error) {
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
            const lxdResponse: any = await (await fetch(`${process.env.LXD_SERVER}/1.0/instances/${id}?project=${process.env.PROJECT}&recursion=1`)).json();

            if (lxdResponse.status_code === 200) {
                send.ok(res, "", lxdResponse);
            } else {
                send.internalError(res);
            }
        }

    } catch (error) {
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
            const lxdResponse: any = await (await fetch(`${process.env.LXD_SERVER}/1.0/instances/${id}/state?project=${process.env.PROJECT}`, {
                method: "PUT",
                body: JSON.stringify({ "action": "start" })
            })).json();

            if (lxdResponse.status_code === 100) {
                send.ok(res);
            } else {
                send.internalError(res);
            }
        }

    } catch (error) {
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
            const lxdResponse: any = await (await fetch(`${process.env.LXD_SERVER}/1.0/instances/${id}/state?project=${process.env.PROJECT}`, {
                method: "PUT",
                body: JSON.stringify({ "action": "stop", "force": true })
            })).json();

            if (lxdResponse.status_code === 100) {
                send.ok(res);
            } else {
                send.internalError(res);
            }
        }

    } catch (error) {
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
            const lxdResponse: any = await (await fetch(`${process.env.LXD_SERVER}/1.0/instances/${id}/state?project=${process.env.PROJECT}`, {
                method: "PUT",
                body: JSON.stringify({ "action": "restart" })
            })).json();

            if (lxdResponse.status_code === 100) {
                send.ok(res);
            } else {
                send.internalError(res);
            }
        }

    } catch (error) {
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
            const lxdResponse: any = await (await fetch(`${process.env.LXD_SERVER}/1.0/instances/${id}?project=${process.env.PROJECT}`, {
                method: "DELETE"
            })).json();

            if (lxdResponse.status_code === 100) {
                send.ok(res);
            } else {
                send.internalError(res);
            }
        }
    } catch (error) {
        send.internalError(res);
    }
};