/*
Dependencies
*/
import { exec } from 'child_process';
import _ from 'lodash';
import os from 'os';

// Custom libs
import logger from '../lib/logger';


module.exports = {

  /*
  OS Info
  */
  osInfo(req, res) {

    // Agafem valors
    const values = {
      hostname: os.hostname(),
      type: os.type(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      tmpdir: os.tmpdir(),
      cpus: os.cpus().length,
    };

    // Convertim objecte a text
    let text = '';

    _.each(values, (value, key) => {
      text += key + ': ' + value + '\n';
    });

    return res.status(200).send(text);
  },


  /*
  Node Info
  */
  nodeInfo(req, res) {

    exec('node -v -desc', { encoding: 'utf8', maxBuffer: 100*1024*1024 }, function(err, stdout, stderr) {
      if (err) return res.status(500).send(err);
      return res.status(200).send(stdout);
    });
  },


  /*
  Node Modules
  */
  nodeModules(req, res) {

    exec('npm ls --long --depth=0 --parseable | sort -u', { encoding: 'utf8', maxBuffer: 10*1024*1024 }, function(err, stdout, stderr) {
      if (err) return res.status(500).send(err);

      // creem nou text substituint cada linea
      let text = '';
      let lines = stdout.split('\n');

      _.each(lines, (value) => {
        if (value.indexOf('node_modules') !== -1) {
          text += value.split(':')[1] + '\n';
        }
      });

      return res.status(200).send(text);
    });
  },


  /*
  Mongo Info
  */
  mongoInfo(req, res) {

    exec('mongod -version', { encoding: 'utf8', maxBuffer: 100*1024*1024 }, function(err, stdout, stderr) {
      if (err) return res.status(500).send(err);
      return res.status(200).send(stdout);
    });
  },


  /*
  Get logs --> Winston logger query
  */
  getLogs(req, res) {

    const options = {
        from: new Date - 10 * 24 * 60 * 60 * 1000,
        until: new Date,
        limit: 10,
        start: 0,
        order: 'desc'
      };

    logger.query(options, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send(results.file);
      }
    });
  }
};
