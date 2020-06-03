'use strict';

module.exports = {
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  nunjucks:{
    enable: true,
    package: 'egg-view-nunjucks',
  },
  redis:{
    enable: false,
    package: 'egg-redis',
  },
  cors : {
    enable: true,
    package: 'egg-cors',
  }
}





