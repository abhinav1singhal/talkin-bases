import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import VideoCapture from '../components/VideoCapture';
import AnalysisResult from '../components/AnalysisResult';
import { analyzeVideo } from '../services/api';

const MainPage = () => {
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoCapture = async (videoBlob, question) => {
    try {
      setIsLoading(true);
      const result = await analyzeVideo(videoBlob, question);
      setAnalysisResult(result); // This is optional if you still want to show the result separately.
      return result; // Ensure the result is returned to the VideoCapture component.
    } catch (error) {
      console.error('Error analyzing video:', error);
      setAnalysisResult('Error analyzing video');
      return 'Error analyzing video'; // Return error to VideoCapture component.
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Talkin Bases
      </Typography>
      <VideoCapture onVideoCapture={handleVideoCapture} />
      {isLoading && <Typography>Analyzing video...</Typography>}
      {analysisResult && <AnalysisResult result={analysisResult} />}
    </Container>
  );
};

export default MainPage;
