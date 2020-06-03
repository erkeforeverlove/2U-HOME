'use strict';

module.exports = app => {
  require('./routes/admin')(app)
  require('./routes/index')(app)
  require('./routes/api')(app)
};
