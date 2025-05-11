export interface Participant {
    id: number;
    name: string;
    email: string;
    birthdate: string;
    createdAt: string;
    updatedAt: string;
}
export interface ParticipantsResponse {
    data: Participant[];
    message: string;
}