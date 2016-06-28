// updates the ytdl binary on demand
import SettingsHandler from '../helpers/SettingsHandler'
import {ErrorData, SuccessData, InfoData} from '../Data/Messagedata'
import mrEmitter from '../helpers/mrEmitter'
import moment from 'moment'

let settingsHandle = new SettingsHandler(),
stored = settingsHandle.stored,
ytdlProcess

export default class YtdlUpdater {
  constructor(published_at, url) {
    // start updating
    this.startUpdateExe(published_at, url)
  }

  startUpdateExe = (published_at, url) => {
    which('youtube-dl', (err, resolvedPath) => {
      // err is returned if no 'exe' is found on the PATH
      // if it is found, then the absolute path to the exec is returned
      if (err) {
        throw err
        return
      }

      let pathToExe = path.dirname(resolvedPath),
      filePath = path.join(pathToExe, 'youtube-dl.exe.temp')

      // start download of youtube-dl
      wget({
        url:  url,
        dest: filePath,      // destination path or path with filenname, default is ./
        timeout: 10000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
      }, (error, response, body) => {
        if (error) {
          throw error
        } else {
          // update the stored data
          settingsHandle.updateStores('youtubedl', {
            published_at: published_at,
            lasttried: moment(),
            path: pathToExe,
            // to update the temp file over exe file
            toUpdate: true
          })
          // show a message that you need to restart or close and open youtube dl next time to see an updated version
          mrEmitter.emit('onYoutubeDlUpdate', InfoData.updateDownloaded)
        }
      })
    })
  }
}