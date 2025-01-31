import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Grid, TextField, List, ListItem, Paper, Typography } from '@mui/material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VideoCapture = ({ onVideoCapture }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoBlob, setVideoBlob] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [facingMode, setFacingMode] = useState("user");
  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm'
    });
    mediaRecorderRef.current.addEventListener('dataavailable', ({ data }) => {
      if (data.size > 0) setRecordedChunks((prev) => prev.concat(data));
    });
    mediaRecorderRef.current.start();
  }, [webcamRef]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, []);

  const handleFinalizeVideo = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      setVideoBlob(blob);
      setRecordedChunks([]);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (videoBlob && question) {
      const result = await onVideoCapture(videoBlob, question); // Await the result here.
      setChatHistory((prev) => [...prev, { question, answer: result }]); // Append new entry to the history.
      setQuestion(''); // Clear the question input.
    }
  }, [videoBlob, question, onVideoCapture]);
  

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setQuestion(transcript);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Button onClick={handleCameraToggle}>
          {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        </Button>
      </Grid>
      {isCameraOn && (
        <>
          <Grid item>
            <Webcam audio={false} ref={webcamRef} videoConstraints={{ facingMode: facingMode }}/>
          </Grid>
          <Grid item>
            <Button onClick={toggleCamera}>
              Switch to {facingMode === "user" ? "Back" : "Front"} Camera
            </Button>
          </Grid>
          <Grid item>
            {capturing ? (
              <Button onClick={handleStopCaptureClick}>Stop Recording</Button>
            ) : (
              <Button onClick={handleStartCaptureClick}>Start Recording</Button>
            )}
            {recordedChunks.length > 0 && (
              <Button onClick={handleFinalizeVideo}>Finalize Recording</Button>
            )}
          </Grid>
        </>
      )}
      <Grid item>
        <TextField
          fullWidth
          label="Ask a question about the video"
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={!videoBlob}
        />
      </Grid>
      <Grid item>
        <Button onClick={handleAnalyze} disabled={!videoBlob || !question}>
          Analyze Video
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={handleStartListening} disabled={listening}>
          Start Voice Input
        </Button>
        <Button onClick={handleStopListening} disabled={!listening}>
          Stop Voice Input
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="h6">Chat History</Typography>
        <List style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
          {chatHistory.map((chat, index) => (
            <ListItem key={index} style={{ marginBottom: '1rem' }}>
              <Paper style={{ padding: '1rem', width: '100%' }}>
                <Typography variant="body1">
                  <strong>Q:</strong> {chat.question}
                </Typography>
                <Typography variant="body2" style={{ marginTop: '0.5rem' }}>
                  <strong>A:</strong> {chat.answer}
                </Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default VideoCapture;
