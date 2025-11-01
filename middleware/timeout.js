const timeoutMiddleware = (timeoutMs = 50000) => {
  return (req, res, next) => {
    req.setTimeout(timeoutMs, () => {
      res.status(408).json({
        error: 'Request timeout',
        message: 'The request took too long to process'
      });
    });

    res.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(504).json({
          error: 'Gateway timeout',
          message: 'The server took too long to respond'
        });
      }
    });

    next();
  };
};

module.exports = timeoutMiddleware;
