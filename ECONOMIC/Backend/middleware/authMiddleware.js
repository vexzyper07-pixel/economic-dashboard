const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(403).json({ message: "Authorization token required" });
  }

  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : header;

  if (!token) {
    return res.status(403).json({ message: "Authorization token required" });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "insecure_dev_secret"
    );

    req.user = verified;
    next();
  } catch (err) {
    console.error("Invalid token", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
