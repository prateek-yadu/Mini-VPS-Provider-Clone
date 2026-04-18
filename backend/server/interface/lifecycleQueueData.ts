export interface lifecycleQueueData {
    name: string;
    operation: "start" | "stop" | "restart" | "delete";
    planId?: string;
    instanceIPID?: string;
}