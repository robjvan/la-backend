import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseStorageService {
  private storage: admin.storage.Storage;

  onModuleInit() {
    // console.log(path.join(__dirname, '../../../'));
    admin.initializeApp({
      credential: admin.credential.cert(
        path.join(__dirname, '../../../secretAccountKey.json'), // Adjust path
      ),
      storageBucket: 'your-project-id.appspot.com',
    });
    this.storage = admin.storage();
  }

  async uploadImage(
    file: Express.Multer.File,
    plantId: number,
  ): Promise<string> {
    const bucket = this.storage.bucket();
    const fileName = `plants/${plantId}/${Date.now()}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true,
    });

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }
}
