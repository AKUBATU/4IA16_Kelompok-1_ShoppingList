export function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    detail: process.env.NODE_ENV === "production" ? undefined : String(err?.message ?? err)
  });
}
