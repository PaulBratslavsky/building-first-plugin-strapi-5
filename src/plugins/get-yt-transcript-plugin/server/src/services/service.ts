import type { Core } from '@strapi/strapi';

const fetchTranscript = async (
  url: string
): Promise<(string | undefined)[] | undefined> => {
  const { Innertube } = await import("youtubei.js");

  const youtube = await Innertube.create({
    lang: "en",
    location: "US",
    retrieve_player: false,
  });

  try {
    const info = await youtube.getInfo(url);
    const transcriptData = await info.getTranscript();
    return transcriptData?.transcript?.content?.body?.initial_segments.map(
      (segment) => segment.snippet.text
    );
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
};

  async function getYouTubeTranscript(videoUrl: string) {
  const videoId = new URL(videoUrl).searchParams.get("v");
  const transcript = await fetchTranscript(videoId);
  return transcript?.join(" ");
}

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  
  async getYoutubeTranscript(videoId: string) {
    const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    const isValid = youtubeIdRegex.test(videoId);

    if (!isValid) return { error: 'Invalid video ID', data: null };

    try {
      const baseUrl = 'https://www.youtube.com';
      const path = '/watch';
      const url = new URL(path, baseUrl);
      url.searchParams.set('v', videoId);

      const transcript = await getYouTubeTranscript(url.href);
      return transcript;

    } catch (error) {
      return { error: 'Error fetching transcript: ' + error, data: null };
    }

  },
});

export default service;