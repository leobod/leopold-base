const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

const isSubclassOf = (Subclass, Superclass) => {
  while (Subclass) {
    if (Subclass === Superclass) {
      return true
    }
    Subclass = Object.getPrototypeOf(Subclass.prototype)
  }
  return false
}

export { isEmpty, isSubclassOf }
