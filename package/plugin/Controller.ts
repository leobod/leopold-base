export const GET = function (fn) {
  return async function (ctx) {
    if (ctx.method === 'GET') {
      fn && (await fn(ctx))
    }
  }
}

export const POST = function (fn) {
  return async function (ctx) {
    if (ctx.method === 'POST') {
      fn && (await fn(ctx))
    }
  }
}

export const PUT = function (fn) {
  return async function (ctx) {
    if (ctx.method === 'PUT') {
      fn && (await fn(ctx))
    }
  }
}

export const DELETE = function (fn) {
  return async function (ctx) {
    if (ctx.method === 'DELETE') {
      fn && (await fn(ctx))
    }
  }
}

export const OPTIONS = function (fn) {
  return async function (ctx) {
    if (ctx.method === 'OPTIONS') {
      fn && (await fn(ctx))
    }
  }
}

export const defaultAuth = function (audit = [], allow = [], ban = []) {
  const auditList = new Set(audit)
  const allowList = new Set(allow)
  const forbidList = new Set(ban)
  let hasForbid = false
  let hasAllow = false
  for (const forbidItem of forbidList) {
    if (auditList.has(forbidItem)) {
      hasForbid = true
      break
    }
  }
  if (!hasForbid && !hasAllow) {
    for (const allowItem of allowList) {
      if (auditList.has(allowItem)) {
        hasAllow = true
        break
      }
    }
  }
  return hasAllow
}

export const AUTH = function (ctx, audit = [], allow = [], ban = []) {
  const result = defaultAuth(audit, allow, ban)
  if (result) {
    return true
  } else {
    ctx.body = ctx.result('', '暂无权限', 3)
  }
}
