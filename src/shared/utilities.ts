import { UserAnswer } from './types';

const formatDateNumbers = (num: number, size = 2): string => num.toString().padStart(size, '0');

export const getCleanUTCTimestamp = (showMillisecond = false) => {
    const date = new Date();
    if (showMillisecond) {
        return `${date.getUTCFullYear()}-${formatDateNumbers(date.getUTCMonth() + 1)}-${formatDateNumbers(
            date.getUTCDate()
        )} ${formatDateNumbers(date.getUTCHours())}:${formatDateNumbers(date.getUTCMinutes())}:${formatDateNumbers(
            date.getUTCSeconds()
        )}.${formatDateNumbers(date.getUTCMilliseconds(), 3)}`;
    }
    return `${date.getUTCFullYear()}${formatDateNumbers(date.getUTCMonth() + 1)}${formatDateNumbers(
        date.getUTCDate()
    )}${formatDateNumbers(date.getUTCHours())}${formatDateNumbers(date.getUTCMinutes())}${formatDateNumbers(
        date.getUTCSeconds()
    )}`;
};

export const saveLog = () => {
    const _userAnswers = sessionStorage.getItem('user-answers');
    const userAnswers = JSON.parse(_userAnswers === null ? 'Error when getting user answers' : _userAnswers)
        .map(
            (ans: UserAnswer) =>
                `${ans.index + 1},${ans.filename},${ans.answer},${ans.answerInPlainText},${
                    ans.userAnswerMatchesGroundTruth ? 'Correct' : 'Wrong'
                },${ans.answeredAt},${ans.answeredAtUTC},${ans.timeElapsed}\n`
        )
        .join('');
    const imageSet = sessionStorage.getItem('image-set');

    const blob = `sessionStartEpochTimestamp, ${sessionStorage.getItem(
        'session-start-epoch-timestamp'
    )}\nsessionStartUTCTimestamp, ${sessionStorage.getItem(
        'session-start-UTC-timestamp'
    )}\nimageSet,${imageSet}\nindex,filename,answer,answerInPlainText,userAnswerMatchesGroundTruth,answeredAtEpochTimestamp,answeredAtUTCTimestamp,timeElapsed(ms)\n${userAnswers}`;
    console.log(blob);
    download(`photoExposureAnswers_set${imageSet}_${getCleanUTCTimestamp()}.csv`, blob);
};

// https://stackoverflow.com/a/18197341, by mikemaccana
function download(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export const guessGroundTruthFromFilename = (filename: string) => {
    if (filename.match(/_Under_([0-9].*).JPG$/)) {
        return 0;
    }
    if (filename.match(/_Auto_([0-9].*).JPG$/)) {
        return 1;
    }
    if (filename.match(/_Over_([0-9].*).JPG$/)) {
        return 2;
    }
    return -1;
};
