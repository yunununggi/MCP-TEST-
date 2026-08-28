 import { Server } from "@modelcontextprotocol/sdk/server/index.js";
 import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
 import {
   CallToolRequestSchema,
   ListToolsRequestSchema,
 } from "@modelcontextprotocol/sdk/types.js";

 // 1. MCP 서버 초기화
 const server = new Server(
   { name: "test-hello-mcp", version: "1.0.0" },
   { capabilities: { tools: {} } }
 );

 // 2. AI에게 우리가 제공할 도구(say_hello) 리스트 알려주기
 server.setRequestHandler(ListToolsRequestSchema, async () => {
   return {
     tools: [
       {
         name: "say_hello",
         description: "Greets the user with their name and a welcome message.",
         inputSchema: {
           type: "object",
           properties: {
             name: {
               type: "string",
               description: "The name of the person to greet",
             },
           },
           required: ["name"],
         },
       },
     ],
   };
 });

 // 3. AI가 say_hello 도구를 실행했을 때 실제 백엔드 동작 정의
 server.setRequestHandler(CallToolRequestSchema, async (request) => {
   if (request.params.name === "say_hello") {
     const name = request.params.arguments?.name as string;
     return {
       content: [
         {
           type: "text",
           text: `안녕하세요, ${name}님! 성공적으로 웅기님의 첫 MCP 플러그인이 실행되었습니다! 🎉`,
         },
       ],
     };
   }
   throw new Error("요청하신 도구를 찾을 수 없습니다.");
 });

 // 4. 서버 시작 (표준 입출력 stdio 방식 사용)
 async function main() {
   const transport = new StdioServerTransport();
   await server.connect(transport);
   console.error("Test Hello MCP server is running...");
 }

 main().catch((error) => {
   console.error("Server error:", error);
   process.exit(1);
 });