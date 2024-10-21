import { ServerResponse } from "node:http";

const sendErrorResonse = (
  status: number,
  message: string,
  response: ServerResponse
) => {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ message }));
};

export { sendErrorResonse };
