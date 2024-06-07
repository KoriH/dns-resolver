
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const creatorName = 'RoaringKitty';
  const searchQuery = `${creatorName} stock`;

  // Function to scrape Reddit
  async function scrapeReddit() {
    const redditUrl = `https://www.reddit.com/search/?q=${encodeURIComponent(searchQuery)}`;
    await page.goto(redditUrl, { waitUntil: 'networkidle2' });

    const redditResults = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.Post')).map(post => ({
        title: post.querySelector('h3') ? post.querySelector('h3').innerText : 'No title',
        link: post.querySelector('a') ? post.querySelector('a').href : 'No link'
      }));
    });

    return redditResults;
  }

  // Function to scrape Twitter
  async function scrapeTwitter() {
    const twitterUrl = `https://twitter.com/search?q=${encodeURIComponent(searchQuery)}&f=live`;
    await page.goto(twitterUrl, { waitUntil: 'networkidle2' });

    const twitterResults = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('article')).map(tweet => ({
        content: tweet.querySelector('div[lang]') ? tweet.querySelector('div[lang]').innerText : 'No content',
        link: tweet.querySelector('a') ? `https://twitter.com${tweet.querySelector('a').getAttribute('href')}` : 'No link'
      }));
    });

    return twitterResults;
  }

  // Function to scrape YouTube
  async function scrapeYouTube() {
    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    await page.goto(youtubeUrl, { waitUntil: 'networkidle2' });

    const youtubeResults = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('ytd-video-renderer')).map(video => ({
        title: video.querySelector('#video-title') ? video.querySelector('#video-title').innerText : 'No title',
        link: video.querySelector('#video-title') ? `https://www.youtube.com${video.querySelector('#video-title').getAttribute('href')}` : 'No link'
      }));
    });

    return youtubeResults;
  }

  const redditResults = await scrapeReddit();
  const twitterResults = await scrapeTwitter();
  const youtubeResults = await scrapeYouTube();

  console.log('Reddit Results:', redditResults);
  console.log('Twitter Results:', twitterResults);
  console.log('YouTube Results:', youtubeResults);

  await browser.close();
})();
