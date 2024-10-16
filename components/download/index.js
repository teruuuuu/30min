import fs from 'fs'
import { DOWNLOAD_IMAGE_EXTENSION, DOWNLOAD_IMAGE_PATH } from '../../const'

export const downloadImagePath = DOWNLOAD_IMAGE_PATH
export const downloadImageExtention = DOWNLOAD_IMAGE_EXTENSION

const saveImageIfNeeded = async (blocksWithChildren, path) => {
  const tmpPath = `${downloadImagePath}/${path}`
  const tmpBlock = blocksWithChildren
  
  // try { fs.rmSync(tmpPath, { recursive: true, force: true }); }
  // catch(err) { console.error(err)}
  
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath)
  }

  tmpBlock.forEach(async (block) => {
    const image = block.image
    await save(tmpPath, image)
    const image1 = block.image1
    await save(tmpPath, image1)
    const image2 = block.image2
    await save(tmpPath, image2)
    const image3 = block.image3
    await save(tmpPath, image3)
    const imageEn = block.image_en
    await save(tmpPath, imageEn)
  })
}

const save = async (tmpPath, image) => {
  if(!image){
    console.log("not found image")
      return
  }
  
  await checkBlock(tmpPath, image)
  // if (block.has_children) {
  //   block.children?.forEach(async (block) => await checkBlock(block, tmpPath))
  // }
}

const checkBlock = async (path, image) => {

  if (image.type == 'files' && image.files[0]) {

    const tmpName = image.files[0].name
    const name = tmpName.replace(/ /g, '_')

    const url = image.files[0].file.url
    const blob = await getTemporaryImage(url)

    if (!blob) {
      console.log("not found blob")
      return ''
    }

    const extension = blob.type.replace('image/', '')

    if (!isImageExist(path, name)) {
      const binary = (await blob.arrayBuffer())
      const buffer = Buffer.from(binary)
      await saveImage(buffer, path, name)
    } else {
      console.log("already exist image.")
    }
  }
}

/// 一時ファイルの画像をバイナリとして取得する。ここで画像のフォーマットがわかる
const getTemporaryImage = async (url) => {
  try {
    const blob = await fetch(url).then((r) => r.blob())
    return blob
  } catch (error) {
    console.log(error)
    return null
  }
}

const isImageExist = (path, keyName) => {
  return fs.existsSync(path + '/' + keyName + downloadImageExtention)
}

const saveImage = (imageBinary, path, keyName) => {
//   fs.writeFile(path + '/' + keyName + downloadImageExtention, imageBinary, (error) => {
//     if (error) {
//       console.log(error)
//       throw error
//     }
//   })

  const maxRetries = 3
  const saveWithRetry = (attempt) => {
    
    fs.writeFile(path + '/' + keyName + downloadImageExtention, imageBinary, (error) => {
      if (error) {
        if (attempt < maxRetries) {
          console.log(`Error during saveImage, attempt ${attempt + 1} of ${maxRetries}. Retrying in ${retryDelay}ms...`);
          setTimeout(() => save(attempt + 1), retryDelay);
        } else {
          console.log('Max retries reached. Error during saveImage:');
          console.log(error);
          throw error;
        }
      } else {
        console.log('Image saved successfully.');
      }
    });
  };

  saveWithRetry(0)
}

export default saveImageIfNeeded