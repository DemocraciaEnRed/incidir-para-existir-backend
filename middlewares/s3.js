require("dotenv").config();

const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer')
const multerS3 = require('multer-s3')

const parseUrl = (urlString) => {
  if (!urlString) {
    throw new Error("Invalid URL: URL string is undefined or null");
  }
  console.log(urlString)
  const url = new URL(urlString);
  return url
}

const endpoint = process.env.DO_SPACES_ENDPOINT;
if (!endpoint) {
  throw new Error("Environment variable DO_SPACES_ENDPOINT is not set");
}

module.exports = multer({
  fileFilter: (req, file, cb) => {
    // validate file
    console.log("file data", file);
    const isValid = true;
    cb(null, isValid);
    // cb(new Error("I don't have a clue!")); can also throw errors
  },
  storage: multerS3({
    s3: new S3Client({
      forcePathStyle: false,
      endpoint: parseUrl(process.env.DO_SPACES_ENDPOINT || null),
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || null,
        secretAccessKey: process.env.DO_SPACES_SECRET || null,
      },
      // region: "us-east-1",
      endpoint: 'https://nyc3.digitaloceanspaces.com',
      region: 'nyc3',
    }),
    bucket: process.env.DO_SPACES_BUCKET || null,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      // save file to Spaces, you can use / to add folders directory
      const fileName = Date.now().toString(); //file.originalname;
      const extension = file.originalname.split('.').pop();
      cb(null, `guilleTest/${fileName}.${extension}`);
    }
  })
})

