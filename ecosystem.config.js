module.exports = {
  apps: [
    {
      name: "client",
      cwd: "./client",
      script: "cmd",
      args: "/c npm run dev",
      watch: false
    },
    {
      name: "auth-service",
      cwd: "./server/auth-service",
      script: "cmd",
      args: "/c npm run dev",
      watch: true
    },
    {
      name: "user-service",
      cwd: "./server/user-service",
      script: "cmd",
      args: "/c npm run dev",
      watch: true
    },
    {
      name: "messaging-service",
      cwd: "./server/messaging-service",
      script: "cmd",
      args: "/c npm run dev",
      watch: true
    },
    {
      name: "realtime-service",
      cwd: "./server/realtime-service",
      script: "cmd",
      args: "/c npm run dev",
      watch: true
    },
  ]
};
