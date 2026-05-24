const mongoose = require('mongoose');
const dns = require('node:dns');

const isDnsLookupError = (error) =>
   ['ESERVFAIL', 'ECONNREFUSED', 'ETIMEOUT', 'ENOTFOUND', 'EAI_AGAIN'].includes(error.code) ||
   ['querySrv', 'queryTxt', 'getaddrinfo'].includes(error.syscall);

const connectDB = async () => {
   try{
      if (!process.env.MONGO_URI) {
         throw new Error('MONGO_URI is missing from .env');
      }

      if (process.env.MONGO_DNS_SERVERS) {
         const servers = process.env.MONGO_DNS_SERVERS
            .split(',')
            .map((server) => server.trim())
            .filter(Boolean);

         if (servers.length > 0) {
            dns.setServers(servers);
         }
      }

      try {
         await mongoose.connect(process.env.MONGO_URI);
      } catch (error) {
         if (!process.env.MONGO_URI_DIRECT || !isDnsLookupError(error)) {
            throw error;
         }

         console.warn('MongoDB SRV lookup failed. Retrying with MONGO_URI_DIRECT...');
         await mongoose.connect(process.env.MONGO_URI_DIRECT);
      }

      console.log("MongoDB Connected")
   }
   
   catch(error){
      console.error(`Error: ${error.message}`);
      process.exit(1);
   }
};

module.exports = connectDB
