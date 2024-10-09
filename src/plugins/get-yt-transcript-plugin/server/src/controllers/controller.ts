import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getYoutubeTranscript(ctx) {
    ctx.body = await strapi
      .plugin('get-yt-transcript-plugin')
      .service('service')
      .getYoutubeTranscript(ctx.params.videoId);
  },
});

export default controller;
