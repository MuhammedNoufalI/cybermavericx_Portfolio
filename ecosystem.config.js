module.exports = {
  apps: [
    {
      name: 'portfolio',
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      env: { NODE_ENV: 'production' },
    },
  ],
}
