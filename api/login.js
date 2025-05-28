export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  if (username === 'admin' && password === '1234') {
    res.setHeader('Set-Cookie', 'session=valid; Path=/; HttpOnly; SameSite=Lax');
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
