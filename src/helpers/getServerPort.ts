const getServerPort = () =>
  process.env.WORKER_PORT
    ? Number(process.env.WORKER_PORT)
    : Number(process.env.PORT) || 4000;

export { getServerPort };
