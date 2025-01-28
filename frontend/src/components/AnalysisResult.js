import React from 'react';
import { Typography, Paper } from '@mui/material';

const AnalysisResult = ({ result }) => {
  return (
    <Paper elevation={3} style={{ padding: '1rem', marginTop: '1rem' }}>
      <Typography variant="h6">Analysis Result:</Typography>
      <Typography variant="body1">{result}</Typography>
    </Paper>
  );
};

export default AnalysisResult;
