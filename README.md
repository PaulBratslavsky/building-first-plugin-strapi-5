# Building Your First Strapi Plugin: YouTube Transcript Fetcher

This guide will walk you through the process of creating a Strapi plugin that fetches YouTube video transcripts.

## Step 1: Set up Strapi

1. Create a new Strapi project:
   ```bash
   npx create-strapi-app@latest get-yt-summary
   ```
2. Follow the prompts to set up your project:
   - Use the default SQLite database
   - Don't start with example structure & data
   - Use TypeScript
   - Install dependencies with npm
   - Initialize a git repository

3. Start Strapi:
   ```bash
   yarn develop
   ```
4. Create your first admin user through the Strapi admin panel.

## Step 2: Initialize the Plugin

1. Use the Strapi Plugin CLI SDK to create a new plugin:
   ```bash
   npx @strapi/sdk-plugin@latest init get-yt-transcript-plugin
   ```
2. Follow the prompts to set up your plugin:
   - Plugin name: get-yt-transcript-plugin
   - Display name: YT Transcript
   - Description: Get YT transcript.
   - Register with the server: yes
   - Use TypeScript: yes

## Step 3: Configure the Plugin

1. Reference the plugin in Strapi's configuration. Create or edit `config/plugins.ts`:
   ```typescript
   export default {
     'get-yt-transcript-plugin': {
       enabled: true,
       resolve: './src/plugins/get-yt-transcript-plugin'
     },
   }
   ```

2. Navigate to the plugin folder and install dependencies:
   ```bash
   cd src/plugins/get-yt-transcript-plugin
   yarn install
   ```

3. Build the plugin:
   ```bash
   yarn build
   ```

4. Start the plugin in watch mode:
   ```bash
   yarn watch
   ```

5. Restart your Strapi server:
   ```bash
   yarn develop
   ```

## Step 4: Set Up Plugin Routes

1. Update `src/plugins/get-yt-transcript-plugin/server/src/routes/index.ts`:
   ```typescript
   import contentApi from "./content-api";
   import admin from "./admin";

   export default {
     "content-api": {
       type: "content-api",
       routes: [...contentApi],
     },
     admin: {
       type: "admin",
       routes: [...admin],
     },
   };
   ```

2. Create `src/plugins/get-yt-transcript-plugin/server/src/routes/content-api.ts`:
   ```typescript
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
   ```

3. Create `src/plugins/get-yt-transcript-plugin/server/src/routes/admin.ts`:
   ```typescript
   export default [
     {
       method: 'GET',
       path: '/',
       handler: 'controller.index',
       config: {
         policies: [],
       },
     },
   ];
   ```

## Step 5: Create the Service

1. Create `src/plugins/get-yt-transcript-plugin/server/src/services/index.ts`:
   ```typescript
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
   ```

2. Install the required library:
   ```bash
   yarn add youtubei.js
   ```

## Step 6: Create the Controller

1. Create `src/plugins/get-yt-transcript-plugin/server/src/controllers/index.ts`:
   ```typescript
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
   ```

## Step 7: Test the Plugin

1. Ensure your Strapi server is running:
   ```bash
   yarn develop
   ```

2. Test the endpoint by visiting:
   ```
   http://localhost:1337/api/get-yt-transcript-plugin/yt-transcript/dQw4w9WgXcQ
   ```
   Replace `dQw4w9WgXcQ` with any valid YouTube video ID.

Congratulations! You've now created a Strapi plugin that fetches YouTube video transcripts. This plugin demonstrates how to create custom routes, services, and controllers within a Strapi plugin.# building-first-plugin-strapi-5
