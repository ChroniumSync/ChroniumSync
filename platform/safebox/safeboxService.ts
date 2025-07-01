
import { BlobServiceClient, ContainerClient, BlobUploadCommonResponse } from "@azure/storage-blob"

export class SafeboxService {
  private blobServiceClient: BlobServiceClient

  constructor(connectionString: string) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  }


 
  async ensureContainer(containerName: string): Promise<ContainerClient> {
    const containerClient = this.blobServiceClient.getContainerClient(containerName)
    const exists = await containerClient.exists()
    if (!exists) {
      await containerClient.create()
    }
    return containerClient
  }

  /**
   * Uploads data (string or Buffer) to the specified container under the given blob name.
   */
  async upload(
    containerName: string,
    blobName: string,
    content: string | Buffer
  ): Promise<BlobUploadCommonResponse> {
    const containerClient = await this.ensureContainer(containerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    return blockBlobClient.uploadData(content)
  }

  /**
   * Downloads the specified blob content as a Buffer.
   */
  async download(
    containerName: string,
    blobName: string
  ): Promise<Buffer> {
    const containerClient = await this.ensureContainer(containerName)
    const blobClient = containerClient.getBlobClient(blobName)
    const resp = await blobClient.download()
    const chunks: Buffer[] = []
    for await (const chunk of resp.readableStreamBody!) {
      chunks.push(chunk)
    }
    return Buffer.concat(chunks)
  }

  /**
   * Deletes the specified blob.
   */
  async delete(
    containerName: string,
    blobName: string
  ): Promise<void> {
    const containerClient = await this.ensureContainer(containerName)
    const blobClient = containerClient.getBlobClient(blobName)
    await blobClient.deleteIfExists()
  }
}
