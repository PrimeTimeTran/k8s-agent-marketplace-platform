export declare const AgentVisibility: {
    readonly PRIVATE: "private";
    readonly ORG: "org";
    readonly PUBLIC: "public";
};
export type AgentVisibility = (typeof AgentVisibility)[keyof typeof AgentVisibility];
export declare const AgentStatus: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly DISABLED: "disabled";
    readonly DEPRECATED: "deprecated";
};
export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus];
export declare const Runtime: {
    readonly PYTHON: "python";
    readonly NODE: "node";
    readonly CUSTOM: "custom";
};
export type Runtime = (typeof Runtime)[keyof typeof Runtime];
export declare const ExecutionStatus: {
    readonly SCHEDULED: "scheduled";
    readonly RUNNING: "running";
    readonly COMPLETED: "completed";
    readonly FAILED: "failed";
};
export type ExecutionStatus = (typeof ExecutionStatus)[keyof typeof ExecutionStatus];
export interface Agent {
    id: string;
    name: string;
    description: string;
    owner_user_id: string;
    owner_org_id?: string | null;
    visibility: AgentVisibility;
    status: AgentStatus;
    created_at: string;
    updated_at: string;
}
export interface AgentVersion {
    id: string;
    agent_id: string;
    version: string;
    image_ref: string;
    entrypoint: string;
    runtime: Runtime;
    is_active: boolean;
    repo_url?: string | null;
    commit_hash?: string | null;
    created_at: string;
}
export interface Execution {
    id: string;
    status: ExecutionStatus;
    agent_id: string;
    agent_version_id: string;
    logs?: string;
    payload?: Record<string, any>;
    created_at: string;
    updated_at: string;
}
export interface CreateAgentDTO {
    name: string;
    description?: string;
    visibility?: AgentVisibility;
}
export interface CreateExecutionDTO {
    agent_id: string;
    prompt: string;
    env?: Record<string, string>;
}
