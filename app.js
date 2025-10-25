const express = require('express');
const { OpenAI } = require('openai');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ALIVE',
    openai: process.env.OPENAI_API_KEY ? 'YES' : 'NO',
    supabase: process.env.SUPABASE_ANON_KEY ? 'YES' : 'NO',
    github: process.env.GITHUB_TOKEN ? 'YES' : 'NO'
  });
});

app.get('/', (req, res) => {
  res.send('<h1>My App is Working! ✅</h1><p>Check <a href="/health">/health</a></p><p>API Console: <a href="/console">/console</a></p>');
});

// API CHAT ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// GITHUB REPOS ENDPOINT
app.get('/api/repos', async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'My-App'
      }
    });
    const repos = await response.json();
    res.json({ repositories: repos.map(repo => repo.name) });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// CONSOLE DASHBOARD
app.get('/console', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>API Console</title>
    <style>
        body { font-family: Arial; margin: 40px; background: #f5f5f5; }
        .card { background: white; padding: 20px; margin: 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .success { border-left: 5px solid #4CAF50; }
    </style>
</head>
<body>
    <h1>🔧 API Console Dashboard</h1>
    
    <div class="card success">
        <h3>✅ Environment Status</h3>
        <p><strong>OpenAI:</strong> ${process.env.OPENAI_API_KEY ? 'CONNECTED (' + process.env.OPENAI_API_KEY.length + ' chars)' : 'MISSING'}</p>
        <p><strong>Supabase:</strong> ${process.env.SUPABASE_ANON_KEY ? 'CONNECTED' : 'MISSING'}</p>
        <p><strong>GitHub:</strong> ${process.env.GITHUB_TOKEN ? 'CONNECTED' : 'MISSING'}</p>
    </div>

    <div class="card">
        <h3>🚀 API Endpoints</h3>
        <p><strong>Chat:</strong> POST /api/chat</p>
        <p><strong>Repos:</strong> GET /api/repos</p>
        <p><strong>Health:</strong> GET /health</p>
    </div>
</body>
</html>
  `);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});