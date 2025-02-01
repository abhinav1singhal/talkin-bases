import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button, Grid, TextField, List, ListItem, Paper, Typography, Select, MenuItem } from '@mui/material';

const VideoCapture = ({ onVideoCapture }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoBlob, setVideoBlob] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [facingMode, setFacingMode] = useState("user");
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognition = useRef(null);
  const synthesis = useRef(window.speechSynthesis);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setQuestion(transcript);
      };
      recognition.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    if (recognition.current) {
      recognition.current.lang = event.target.value;
    }
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
      const result = await onVideoCapture(videoBlob, question);
      setChatHistory((prev) => [...prev, { question, answer: result }]);
      speakResponse(result);
      setQuestion('');
    }
  }, [videoBlob, question, onVideoCapture]);

  const handleStartListening = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
  };

  const speakResponse = (text) => {
    if (synthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      utterance.voice = synthesis.current.getVoices().find(voice => voice.lang === selectedLanguage && voice.gender === 'female');
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthesis.current.speak(utterance);
    }
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
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{ facingMode: facingMode }}
            />
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
        <Select value={selectedLanguage} onChange={handleLanguageChange}>
          <MenuItem value="en-US">English</MenuItem>
          <MenuItem value="hi-IN">Hindi</MenuItem>
          <MenuItem value="vi-VN">Vietnamese</MenuItem>
          <MenuItem value="es-ES">Spanish</MenuItem>
        </Select>
      </Grid>
      <Grid item>
        <TextField
          fullWidth
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
        <Button onClick={handleStartListening} disabled={isListening}>
          Start Voice Input
        </Button>
        <Button onClick={handleStopListening} disabled={!isListening}>
          Stop Voice Input
        </Button>
      </Grid>
      <Grid item>
        <Paper>
          <List>
            <Typography variant="h6">Chat History</Typography>
            {chatHistory.map((chat, index) => (
              <ListItem key={index}>
                <Typography>
                  Q: {chat.question}
                  <br />
                  A: {chat.answer}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default VideoCapture;
