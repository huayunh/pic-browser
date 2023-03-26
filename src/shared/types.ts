export type UserAnswer = {
    index: number;
    filename: string;
    answer: number;
    answerInPlainText: string;
    userAnswerMatchesGroundTruth: boolean;
    answeredAt: number;
    answeredAtUTC: string;
    timeElapsed: number;
};
