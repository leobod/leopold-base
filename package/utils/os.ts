import os from 'os'

const isWin = () => {
  return os.type() === 'Windows_NT'
}

const isMac = () => {
  return os.type() === 'Windows_NT'
}

const isLinux = () => {
  return os.type() === 'Linux'
}

export { isWin, isMac, isLinux }
