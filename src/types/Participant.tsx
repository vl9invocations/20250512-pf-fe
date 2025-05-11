export interface Participant {
    id: number;
    name: string;
    email: string;
    birthdate: string;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}
export interface ParticipantsResponse {
    data: Participant[];
    message: string;
}