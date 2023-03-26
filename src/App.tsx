import React from 'react';
import FILENAMES from './InterraterImageFilenames';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

import { UserAnswer } from './shared/types';
import { saveLog, guessGroundTruthFromFilename } from './shared/utilities';

const styles = {
    appBarProgressBar: {
        backgroundColor: 'primary.light',
        left: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
    },
    targetImage: {
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        flex: 1,
        backgroundRepeat: 'no-repeat',
        width: '100%',
    },
    selectionButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        padding: 3,
        '&:hover': {
            backgroundColor: 'primary.dark',
            color: 'primary.contrastText',
            cursor: 'pointer',
            transitionDuration: '200ms',
        },
        border: '2px solid black',
        boxSizing: 'border-box',
        userSelect: 'none',
    },
};

const App = () => {
    const [lastSelectionTimeStamp, setLastSelectionTimeStamp] = React.useState<null | number>(null);
    const [currentFilenameIndex, setCurrentFilenameIndex] = React.useState(0);

    React.useEffect(() => {
        setLastSelectionTimeStamp(Date.now());
        sessionStorage.clear();
        sessionStorage.setItem('session-start-epoch-timestamp', Date.now().toString());
        sessionStorage.setItem('user-answers', '[]');
    }, []);

    const onSelectOption = (option: number) => {
        const _userAnswers = sessionStorage.getItem('user-answers');
        let userAnswerInPlainText = '';
        switch (option) {
            case 0:
                userAnswerInPlainText = 'Under-Exposed';
                break;
            case 1:
                userAnswerInPlainText = 'Properly Exposed';
                break;
            case 2:
                userAnswerInPlainText = 'Over-Exposed';
                break;
            default:
                break;
        }
        if (_userAnswers !== null && lastSelectionTimeStamp !== null) {
            const userAnswers = JSON.parse(_userAnswers) as UserAnswer[];
            userAnswers.push({
                index: currentFilenameIndex,
                filename: FILENAMES[currentFilenameIndex],
                answer: option,
                answerInPlainText: userAnswerInPlainText,
                userAnswerMatchesGroundTruth: guessGroundTruthFromFilename(FILENAMES[currentFilenameIndex]) === option,
                answeredAt: Date.now(),
                timeElapsed: Date.now() - lastSelectionTimeStamp,
            });
            sessionStorage.setItem('user-answers', JSON.stringify(userAnswers));

            if (currentFilenameIndex + 1 === FILENAMES.length) {
                saveLog();
            } else {
                setCurrentFilenameIndex(currentFilenameIndex + 1);
                setLastSelectionTimeStamp(Date.now());
            }
        }
    };

    return (
        <div className="App" style={{ height: '100vh' }}>
            <AppBar position={'relative'}>
                <Box
                    sx={styles.appBarProgressBar}
                    style={{ width: `${(currentFilenameIndex / (FILENAMES.length - 1)) * 100}%` }}
                ></Box>
                <Toolbar>
                    <Typography variant="h5">{currentFilenameIndex + 1} </Typography>
                    <Typography variant="h6" marginLeft={1}>
                        out of {FILENAMES.length}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Stack direction={'column'} style={{ height: 'calc(100% - 56px)' }} alignItems={'center'} gap={1}>
                <Box
                    sx={styles.targetImage}
                    style={{
                        backgroundImage: `url("${process.env.PUBLIC_URL}/images/${FILENAMES[currentFilenameIndex]}")`,
                    }}
                ></Box>
                <Stack width={900} direction={'row'}>
                    <Box
                        sx={styles.selectionButton}
                        onClick={() => {
                            onSelectOption(0);
                        }}
                    >
                        <Typography variant={'h5'}>Under-Exposed</Typography>
                        <Typography variant={'h6'}>(Too Dark)</Typography>
                    </Box>
                    <Box
                        sx={styles.selectionButton}
                        onClick={() => {
                            onSelectOption(1);
                        }}
                    >
                        <Typography variant={'h5'}>Properly Exposed</Typography>
                        <Typography variant={'h6'}>(Just Right)</Typography>
                    </Box>
                    <Box
                        sx={styles.selectionButton}
                        onClick={() => {
                            onSelectOption(2);
                        }}
                    >
                        <Typography variant={'h5'}>Over-Exposed</Typography>
                        <Typography variant={'h6'}>(Too Bright)</Typography>
                    </Box>
                </Stack>
            </Stack>
        </div>
    );
};

export default App;