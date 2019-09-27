const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

google.options({ auth: oauth2Client });

module.exports = {
  async getAuthorizeUrl(req, res) {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
    });
    return res.json({ status: true, url });
  },
  async authenticate(req, res) {
    try {
      const { code } = req.query;
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.credentials = tokens;
      return res.json({ status: true, tokens });
    } catch (error) {
      return res.json({ status: false, error: error.message });
    }
  },
};
