export default () => ({
  pinoHttp: {
    customProps: (req, res) => ({
      context: 'HTTP',
    }),
    level: process.env.LOG_LEVEL,
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              colorizeObjects: true,
              sync: true,
              singleLine: true,
              translateTime: 'UTC:mm/dd/yyyy, h:MM:ss TT Z',
            },
          }
        : undefined,
  },
});
