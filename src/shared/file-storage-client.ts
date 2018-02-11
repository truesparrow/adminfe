import { Picture } from '@truesparrow/content-sdk-js'


export interface FileStorageClient {
    selectImageWithWidget(position: number): Promise<Picture>;
}
