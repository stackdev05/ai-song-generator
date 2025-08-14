#!/usr/bin/env node

/**
 * Simple API test script for AI Song Generator
 * Run with: node scripts/test-api.js
 */

// Suppress url.parse deprecation warnings from dependencies
process.removeAllListeners('warning');

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

// Test data
const testData = {
  story: {
    query: "A magical forest adventure with talking animals"
  },
  style: {
    query: "A dreamy, acoustic folk song about nature"
  }
};

async function testAPI() {
  console.log('🧪 Testing AI Song Generator API...\n');

  try {
    // Test 1: Assist Story API
    console.log('1️⃣ Testing Assist Story API...');
    try {
      const storyResponse = await axios.post(`${BASE_URL}/assist-story`, { query: testData.story.query });
      console.log('✅ Story API working');
      console.log(`   Story length: ${storyResponse.data.story?.length || 0} characters`);
      console.log(`   Story: ${storyResponse.data.story || 'Unknown'}\n`);

      // Store story for next test
      const generatedStory = storyResponse.data.story;

      // Test 2: Generate Lyrics API
      console.log('2️⃣ Testing Generate Lyrics API...');
      try {
        const lyricsResponse = await axios.post(`${BASE_URL}/generate-lyrics`, {
          query: generatedStory
        });
        console.log('✅ Lyrics API working');
        console.log(`   Lyrics length: ${lyricsResponse.data.lyrics?.length || 0} characters`);
        console.log(`   Title: ${lyricsResponse.data.title}`);
        console.log(`   Lyrics: ${lyricsResponse.data.lyrics || 'Unknown'}`);
        console.log('');

        // Store lyrics and style for next test
        const generatedLyrics = lyricsResponse.data.lyrics;
        const generatedTitle = lyricsResponse.data.title;

        // Test 3: Assist Style API
        console.log('3️⃣ Testing Assist Style API...');
        try {
          const styleResponse = await axios.post(`${BASE_URL}/assist-style`, { query: testData.style.query });
          console.log('✅ Style API working');
          console.log(`   Style Length: ${styleResponse.data.style?.length || 0} characters`);
          console.log(`   Style: ${styleResponse.data.style || 'Unknown'}\n`);

          const generatedStyle = styleResponse.data.style;

          // Test 4: Generate Song API
          console.log('4️⃣ Testing Generate Song API...');
          try {
            const songResponse = await axios.post(`${BASE_URL}/generate-song`, {
              title: generatedTitle,
              lyrics: generatedLyrics,
              style: generatedStyle,
              singing_voice: "Female",
            });
            console.log('✅ Song Generation API working');
            console.log(`   Songs generated: ${songResponse.data.songs?.length || 0}`);
            if (songResponse.data.songs?.length > 0) {
              for (const song of songResponse.data.songs) {
                console.log(`   Song ID: ${song.song_id}`);
                console.log(`   Status: ${song.status}`);
                console.log(`   Title: ${song.title}`);
                console.log(`   Audio Duration: ${song.audio_duration}ms`);
                console.log(`   Audio URL: ${song.audio}`);
                console.log(`   Image URL: ${song.image}`);
              }
            }
            console.log('');

            const songs = songResponse.data.songs;

            // Test 5: Check Progress API
            if (songs && songs.length > 0) {
              console.log('5️⃣ Testing Check Progress API...');
              for(const song of songs) {
                try {
                  const songId = song.song_id;
                  const progressResponse = await axios.get(`${BASE_URL}/check-progress?song_id=${songId}`);
                  console.log('✅ Progress API working');
                  console.log(`   Song ID: ${progressResponse.data.song_id}`);
                  console.log(`   Status: ${progressResponse.data.status}`);
                  console.log(`   Title: ${progressResponse.data.title}`);
                  console.log(`   Audio Duration: ${progressResponse.data.audio_duration}ms`);
                  console.log(`   Audio URL: ${progressResponse.data.audio}`);
                  console.log(`   Image URL: ${progressResponse.data.image}`);
                } catch (progressError) {
                  console.log('❌ Progress API failed:', progressError.response?.data?.error);
                }
              }
            }

          } catch (songError) {
            console.log('❌ Song Generation API failed:', songError.response?.data?.error);
          }

        } catch (styleError) {
          console.log('❌ Style API failed:', styleError.response?.data?.error);
        }

      } catch (lyricsError) {
        console.log('❌ Lyrics API failed:', lyricsError.response?.data?.error);
      }

    } catch (storyError) {
      console.log('❌ Story API failed:', storyError.response?.data?.error);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Next.js development server is running:');
      console.log('   pnpm dev');
    }
  }

  console.log('\n🎯 API testing completed!');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:3000');
    return true;
  } catch {
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log('❌ Server not running on http://localhost:3000');
    console.log('💡 Please start your development server first:');
    console.log('   pnpm dev');
    process.exit(1);
  }

  await testAPI();
}

main().catch(console.error);
