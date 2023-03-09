import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const app = express();
const port = 3000;
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const AWS_BUCKET_NAME = "erp-api-multer-s3-bucket";
const AWS_BUCKET_REGION = "eu-north-1";
const AWS_IAM_USER_KEY = "AKIAYIPAX2XEITREQUOS";
const AWS_IAM_USER_SECRET = "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";

app.use(express.json());

const imageSchema = new mongoose.Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

const dbConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/multer_S3", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB");
  }
};

dbConnect();

const Image = mongoose.model("Image", imageSchema);

const s3 = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_IAM_USER_KEY,
    secretAccessKey: AWS_IAM_USER_SECRET,
  },
});

app.post("/image", upload.single("image"), async (req, res) => {
  console.log("req.body", req.body);
  console.log("req.file", req.file);
  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);
  await s3.send(command);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
