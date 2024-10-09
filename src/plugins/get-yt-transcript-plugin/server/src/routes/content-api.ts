export default [
  {
    method: 'GET',
    path: '/yt-transcript/:videoId',
    handler: 'controller.getYoutubeTranscript',
    config: {  
      policies: [],  
    },  
  },
];