import app from "./src/server";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`🚀 Server is listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
