export interface ITaskSubmissionForm {
    projectName: string;
    category: string;
    timeline: string;
    skills: string[];
    rateType: "hourly" | "fixed";
    minRate: number | string;
    maxRate: number | string;
    description: string;
    attachments: String[];
}