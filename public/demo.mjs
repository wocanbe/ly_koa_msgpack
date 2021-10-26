import * as msgpackr from './msgpackr.js'

async function doAjax (url, reqData) {
  const reqConfig = {
    method: 'POST',
    body: msgpackr.pack(reqData),
    headers: {
      'Content-Type': 'application/msgpack'
    }
  }
  const result = await fetch (url, reqConfig)
  return result
}
export default doAjax
