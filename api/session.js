export default function handler(req, res) {
  const cookie = req.headers.cookie || '';
  if (cookie.includes('session=valid')) {
    return res.status(200).json({ loggedIn: true });
  }

  return res.status(401).json({ loggedIn: false });
}
