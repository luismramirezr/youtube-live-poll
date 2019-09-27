const AsyncPolling = require('async-polling');
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

google.options({ auth: oauth2Client });

module.exports = {
  async subscribe(req, res) {
    const { refreshToken } = req.body;
    try {
      const { socket, tokens } = req.connectedUsers[refreshToken];
      oauth2Client.credentials = tokens;
      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const polling = AsyncPolling(end => {
        (async function getLives() {
          try {
            const response = await youtube.liveBroadcasts.list({
              part: 'snippet',
              broadcastStatus: 'active',
            });
            const { items } = response.data;
            if (items && items.length > 0) {
              console.log('live stream found');
              end(null, items);
            }
          } catch (error) {
            end(error);
          }
        })();
      }, 3000);
      polling.on('result', items => {
        if (items) {
          req.io.to(socket).emit('isLive', items);
          polling.stop();
        }
      });
      polling.on('error', error => {
        console.log(error);
        polling.stop();
        req.io.to(socket).emit('liveError', error);
      });
      polling.run();
    } catch (error) {
      return res.json({ status: false, error });
    }
    return res.json({ status: true });
  },
};
