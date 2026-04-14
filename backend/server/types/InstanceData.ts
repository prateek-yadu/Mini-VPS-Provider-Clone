export interface instanceData {
  id: string;
  name?: string;
  description?: string;
  vCPU: number;
  memory: number;
  storage: number;
  status?: string;
  image?: string;
  ipAddress: string;
  userId?: string | undefined;
  userPlanId?: string;
  regionId?: string;
  rootPassword?: string;
}