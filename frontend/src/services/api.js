import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const analyzeVideo = async (videoBlob, question) => {
  const formData = new FormData();
  formData.append('video', videoBlob, 'captured_video.webm');
  formData.append('question', question);

  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
};
