const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({
    status: 'ALIVE',
    openai: process.env.OPENAI_API_KEY ? 'YES' : 'NO',
    supabase: process.env.SUPABASE_ANON_KEY ? 'YES' : 'NO',
    github: process.env.GITHUB_TOKEN ? 'YES' : 'NO'
  });
});

app.get('/', (req, res) => {
  res.send('<h1>My App is Working! ✅</h1><p>Check <a href="/health">/health</a></p>');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});